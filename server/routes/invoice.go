package routes

import (
	"bytes"
	"encoding/json"
	"strconv"

	"server/middleware"
	"server/models"

	//just for google.Endpoint

	uuid "github.com/gofrs/uuid"
	"github.com/kr/pretty"
	"github.com/startupXchange-team/gorm"
	"github.com/valyala/fasthttp"
)

//GetManyFirms full list or query, paginated
func GetManyInvoices(ctx *fasthttp.RequestCtx) {
	invcs := []models.Invoice{}
	var offset int
	var limit int
	var err error
	UserID, _ := uuid.FromString(ctx.UserValue("ID").(string))
	place := string(ctx.Request.Header.Peek("Place"))

	if strOffst := string(ctx.Request.Header.Peek("Offset" /*!, Whoo, Whoo, Whoo, Whoo, Whoo! */)); strOffst != "" {
		offset, _ = strconv.Atoi(strOffst)
		limit, _ = strconv.Atoi(string(ctx.Request.Header.Peek("Limit")))
	} else {
		offset = 0
		limit = 30
	}
	var count int

	if admin := string(ctx.Request.Header.Peek("Admin")); admin != "" {

		if query := string(ctx.Request.Header.Peek("Query")); query != "" {
			query = "%" + query + "%"
			var filteredInvcs *gorm.DB
			if onlyLate := string(ctx.Request.Header.Peek("OnlyLate")); onlyLate != "" {
				filteredInvcs = models.GetDB().Model(&models.Invoice{}).
					Joins(`JOIN invoice_materials on invoices.id = invoice_materials.invoice_id JOIN materials on materials.id = invoice_materials.material_id 
				JOIN notes on notes.invoice_id = invoices.id`).
					Where(`(invoices.name ILIKE ? OR invoices.description ILIKE ? OR materials.name ILIKE ? OR notes.message ILIKE ?) AND invoices.status = ?`, query, query, query, query, "Late")
			} else {
				filteredInvcs = models.GetDB().Model(&models.Invoice{}).
					Joins(`JOIN invoice_materials on invoices.id = invoice_materials.invoice_id JOIN materials on materials.id = invoice_materials.material_id 
				JOIN notes on notes.invoice_id = invoices.id`).
					Where(`invoices.name ILIKE ? OR invoices.description ILIKE ? OR materials.name ILIKE ? OR notes.message ILIKE ?`, query, query, query, query)
			}
			filteredInvcs.Count(&count) //from https://github.com/jinzhu/gorm/issues/1007; count doesn't work in same line as limit & offset
			err = filteredInvcs.Limit(limit).Offset(offset).Preload("Notes").Preload("Materials").Find(&invcs).Error
		} else { //https://github.com/jinzhu/gorm/issues/1752 quod superioris^ sicut inferioris
			allInvcs := models.GetDB().Model(&models.Invoice{})
			allInvcs.Count(&count)
			err = allInvcs.Limit(limit).Offset(offset).Preload("Notes").Preload("Materials").Find(&invcs).Error
		}
		if err != nil {
			middleware.ResponseMaker(ctx, fasthttp.StatusInternalServerError, false, "Connection Error.", "noData")
		}

	} else {

		var idStr string
		if role := string(ctx.Request.Header.Peek("Role")); role == "Customer" {
			idStr = "cust"
		} else if role == "Contractor" {
			idStr = "contr"
		}
		if query := string(ctx.Request.Header.Peek("Query")); query != "" {
			query = "%" + query + "%"
			var filteredInvcs *gorm.DB
			if onlyLate := string(ctx.Request.Header.Peek("OnlyLate")); onlyLate != "" {
				filteredInvcs = models.GetDB().Model(&models.Invoice{}).
					Joins(`JOIN invoice_materials on invoices.id = invoice_materials.invoice_id JOIN materials on materials.id = invoice_materials.material_id 
				JOIN notes on notes.invoice_id = invoices.id`).
					Where(`invoices.`+idStr+`_id = ? AND (invoices.name ILIKE ? OR invoices.description ILIKE ? OR invoices.cust_email ILIKE ? OR invoices.contr_email ILIKE ? OR materials.name ILIKE ? OR notes.message ILIKE ?) AND invoices.status = ?`, UserID, query, query, query, query, query, query, "Late")
			} else {
				filteredInvcs = models.GetDB().Model(&models.Invoice{}).
					Joins(`JOIN invoice_materials on invoices.id = invoice_materials.invoice_id JOIN materials on materials.id = invoice_materials.material_id 
				JOIN notes on notes.invoice_id = invoices.id`).
					Where(`invoices.`+idStr+`_id = ? AND (invoices.name ILIKE ? OR invoices.description ILIKE ? OR invoices.cust_email ILIKE ? OR invoices.contr_email ILIKE ? OR materials.name ILIKE ? OR notes.message ILIKE ?)`, UserID, query, query, query, query, query, query)
			}
			filteredInvcs.Count(&count) //from https://github.com/jinzhu/gorm/issues/1007; count doesn't work in same line as limit & offset
			err = filteredInvcs.Limit(limit).Offset(offset).Preload("Notes").Preload("Materials").Find(&invcs).Error
		} else { //https://github.com/jinzhu/gorm/issues/1752 quod superioris^ sicut inferioris
			allInvcs := models.GetDB().Model(&models.Invoice{})
			allInvcs.Count(&count)
			err = allInvcs.Limit(limit).Offset(offset).Preload("Notes").Preload("Materials").Find(&invcs).Error
		}
		if err != nil {
			middleware.ResponseMaker(ctx, fasthttp.StatusInternalServerError, false, "Connection Error.", "noData")
		}

	}

	data := map[string]interface{}{"invcs": invcs, "place": place, "pagination": map[string]interface{}{"offset": offset, "limit": limit, "count": count, "place": place}}

	middleware.ResponseMaker(ctx, fasthttp.StatusOK, true, "Paginating Invcs.", data)
} //https://github.com/pilagod/gorm-cursor-paginator, no longer using going w/ default gorm paging table approach

func CreateInvoice(ctx *fasthttp.RequestCtx) {
	inv := &models.Invoice{}
	body := ctx.Request.Body()
	err := json.NewDecoder(bytes.NewReader(body)).Decode(inv)
	if err != nil {
		middleware.ResponseMaker(ctx, fasthttp.StatusBadRequest, false, err.Error(), "noData")
		return
	}

	errC := models.GetDB().Create(inv).Error
	if errC != nil {
		pretty.Println("While creating invoice: ")
		pretty.Println(errC)
	}

	if inv.ID.Bytes() == nil {
		middleware.ResponseMaker(ctx, fasthttp.StatusInternalServerError, false, "Failed To Create Invoice, Connection Error.", "noData")
		return
	}

	middleware.ResponseMaker(ctx, fasthttp.StatusOK, true, "Created Invoice.", map[string]interface{}{"invoice": inv})
	return

}

func ChangeLineItems(ctx *fasthttp.RequestCtx) {
	type invChange struct {
		Name          string            `json:"firmName"`
		Description   string            `json:"angelOrFirm"`
		BillableHours float64           `json:"billHrs"`
		WageRate      float64           `json:"wageRate"`
		SupplyCost    float64           `json:"suppCost"`
		Materials     []models.Material `json:"materials"`
		Notes         []models.Note     `json:"notes"`
	}
	ID, _ := uuid.FromString(ctx.UserValue("ID").(string))

	reqInv := invChange{}
	body := ctx.Request.Body()
	errJ := json.NewDecoder(bytes.NewReader(body)).Decode(&reqInv)
	if errJ != nil {
		middleware.ResponseMaker(ctx, fasthttp.StatusBadRequest, false, errJ.Error(), "noData")
		return
	}

	inv := models.Invoice{}
	err := models.GetDB().Table("invoice").Where("id = ?", (&ID).String()).First(&inv).Error
	if err != nil {
		middleware.ResponseMaker(ctx, fasthttp.StatusInternalServerError, false, "Connection Error.", "noData")
		return
	}

	inv.Name = reqInv.Name
	inv.Description = reqInv.Description
	inv.BillableHours = reqInv.BillableHours
	inv.WageRate = reqInv.WageRate
	inv.SupplyCost = reqInv.SupplyCost

	models.GetDB().Model(&inv).Association("Materials").Delete().Append(reqInv.Materials)
	models.GetDB().Delete(&models.Note{}, "invoice_id = ?", (&ID).String()) //could have also done where and delete Note
	models.GetDB().Model(&inv).Association("Notes").Delete().Append(reqInv.Notes)

	errS := models.GetDB().Save(&inv).Error
	if errS != nil {
		middleware.ResponseMaker(ctx, fasthttp.StatusInternalServerError, false, "Error While Saving Invoice.", "noData")
		return
	}

	middleware.ResponseMaker(ctx, fasthttp.StatusOK, true, "Updated Invoice Line Items.", map[string]interface{}{"invoice": inv})
	return

}

func GetInvoice(ctx *fasthttp.RequestCtx) {
	ID, _ := uuid.FromString(ctx.UserValue("ID").(string))

	inv := &models.Invoice{}
	err := models.GetDB().Table("invoice").Where("id = ?", ID).Find(inv)
	if err != nil {
		middleware.ResponseMaker(ctx, fasthttp.StatusInternalServerError, false, "Error Getting Invoice.", "noData")
		return
	}

	middleware.ResponseMaker(ctx, fasthttp.StatusOK, true, "Got Invoice.", map[string]interface{}{"invoice": inv})
	return
}

func GetFormItems(ctx *fasthttp.RequestCtx) {
	mats := models.Material{}
	err := models.GetDB().Table("material").Find(&mats).Error
	if err != nil {
		middleware.ResponseMaker(ctx, fasthttp.StatusInternalServerError, false, "Connection Error.", "noData")
		return
	}
	custEmails := []string{}
	cust := &[]models.Usertype{}
	models.GetDB().Table("user").Where("role = ?", "Customer").Find(cust)
	for _, cust := range *cust {
		custEmails = append(custEmails, cust.Email)
	}

	middleware.ResponseMaker(ctx, fasthttp.StatusOK, true, "Got Invoice EditCr8 Form Items.", map[string]interface{}{"materials": mats, "custEmails": custEmails})
	return
}
