package handler

import (
	"fmt"
	"github.com/360EntSecGroup-Skylar/excelize"
	"github.com/gin-gonic/gin"
	"log"
	"model"
	"net/http"
	"strconv"
	"strings"
)

func InitTag(e *gin.Engine, r *gin.RouterGroup) {
	_ = log.Println
	r.GET("/tag", listTag)
}

type tagBind struct {
	pageBind
	EPC       string
	LastState []int
}

func listTag(c *gin.Context) {
	doListTag(c, false)
}

func exportTag(c *gin.Context) {
	doListTag(c, true)
}

func doListTag(c *gin.Context, export bool) {
	var pb tagBind
	if err := c.BindQuery(&(pb.pageBind)); err != nil {
		errorReturn(c, err)
		return
	}
	if err := c.BindQuery(&pb); err != nil {
		errorReturn(c, err)
		return
	}
	pb.CheckDefault()
	var list []model.TagView
	var wheres []string
	var vals []interface{}
	if pb.EPC != "" {
		wheres = append(wheres, " epc like ? ")
		vals = append(vals, fmt.Sprintf("%%%s%%", pb.EPC))
	}
	if len(pb.LastState) > 0 {
		var strs []string
		for _, v := range pb.LastState {
			strs = append(strs, strconv.Itoa(v))
		}
		wheres = append(wheres, fmt.Sprintf(" last_state in (%s) ",
			strings.Join(strs, ",")))
	}
	where := ""
	if len(wheres) > 0 {
		where = " WHERE " + strings.Join(wheres, " AND ")
	}
	const viewSql = `
select t.*, 
a.id as asset_id, a.name as asset_name,
s.id as site_id, s.name as site_name
from tag t
  left join asset a on t.asset_id = a.id
  left join reader r on t.reader_id = r.reader_id
  left join site s on t.site_id = s.id
    `
	sql1 := fmt.Sprintf(`
    SELECT COUNT(id) FROM (%s) v
    `+where, viewSql)

	sql := fmt.Sprintf(`
    SELECT * FROM (%s) v `, viewSql)

	sql = sql + where + `
    ORDER BY create_time desc
    `
	if !export {
		sql = sql + " LIMIT ? offset ? "
	}

	var total int64

	if len(vals) == 0 {
		if _, err := db.QueryOne(&total, sql1); err != nil {
			errorReturn(c, err)
			return
		}
	} else {
		if _, err := db.QueryOne(&total, sql1, vals); err != nil {
			errorReturn(c, err)
			return
		}
	}
	if !export {
		vals = append(vals, pb.PageSize)
		vals = append(vals, pb.Index)
	}
	if _, err := db.Query(&list, sql, vals...); err != nil {
		errorReturn(c, err)
		return
	}
	if export {
		p := "tags.xlsx"
		c.Header("Content-Disposition",
			fmt.Sprintf(`attachment; filename="%s"`, p))
		csv := &tagCsv{
			values: list,
		}
		c.Render(200, csv)
	} else {
		c.JSON(200, gin.H{
			"list":       list,
			"pagination": pb.Response(total),
		})
	}
}

type tagCsv struct {
	values []model.TagView
}

func (csv *tagCsv) Render(w http.ResponseWriter) error {
	xlsx := excelize.NewFile()
	sheet := "Sheet1"
	xlsx.NewSheet(sheet)
	header := map[string]string{
		"A1": "EPC编码", "B1": "资产名称", "C1": "基站名称",
		"D1": "更新时间", "E1": "状态",
	}
	xlsx.SetColWidth(sheet, "A", "A", 60)
	xlsx.SetColWidth(sheet, "B", "B", 20)
	xlsx.SetColWidth(sheet, "D", "D", 20)
	xlsx.SetColWidth(sheet, "E", "E", 7)
	for k, v := range header {
		xlsx.SetCellValue(sheet, k, v)
	}
	if len(csv.values) > 0 {
		for i, it := range csv.values {
			state := "未盘点"
			if it.LastState == 1 {
				state = "在库"
			} else if it.LastState == 2 {
				state = "盘亏"
			}
			//s := fmt.Sprintf("%s,%s,%s,%s,%s\n",
			//		it.EPC, it.AssetName, it.SiteName, it.LastUpdate, state)
			idx := strconv.Itoa(i + 2)
			xlsx.SetCellValue(sheet, "A"+idx, it.EPC)
			xlsx.SetCellValue(sheet, "B"+idx, it.AssetName)
			xlsx.SetCellValue(sheet, "C"+idx, it.SiteName)

			xlsx.SetCellValue(sheet, "D"+idx,
				it.LastCheck.Format("2006-01-02 15:04:05"))
			xlsx.SetCellValue(sheet, "E"+idx, state)
		}
	}

	return xlsx.Write(w)

	/*
		w.Write([]byte("EPC编码,资产名称,基站名称,更新时间,状态\n"))
		if len(csv.values) > 0 {
			for _, it := range csv.values {
				state := "未盘点"
				if it.LastState == 1 {
					state = "在库"
				} else if it.LastState == 2 {
					state = "盘亏"
				}
				s := fmt.Sprintf("%s,%s,%s,%s,%s\n",
					it.EPC, it.AssetName, it.SiteName, it.LastUpdate, state)
				w.Write([]byte(s))
			}
		}*/
}

func (csv *tagCsv) WriteContentType(w http.ResponseWriter) {
	t := `application/octet-stream;`
	w.Write([]byte(t))
}
