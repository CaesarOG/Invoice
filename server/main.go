package main

import (
	"bytes"
	"encoding/json"
	"log"

	"server/middleware"
	"server/models"
	"server/routes"

	"github.com/buaazp/fasthttprouter"
	"github.com/valyala/fasthttp"
)

var (
	staticRoutes  = []byte("/static/")
	staticHandler = fasthttp.FSHandler(models.AbsPath+"client/build/", 0) // from ../../static/ -> ../client/build/

	apiRoutes = []uint8("/api/") //byte is uint8's alias
)

// Index is the index handler
func Index(ctx *fasthttp.RequestCtx) { //DONE ../../static/index.html -> ../client/build/index.html
	err := ctx.Response.SendFile(models.AbsPath + "client/build/index.html")
	if err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.Response.Header.Set("Content-Type", "application/json")
		json.NewEncoder(ctx).Encode(err)
		return
	}
	ctx.Response.Header.Set("Content-Type", "text/html")
}

func main() {

	apiRouter := fasthttprouter.New()

	staticFirst := func(ctx *fasthttp.RequestCtx) {
		path := ctx.Path()
		switch {
		case bytes.HasPrefix(path, staticRoutes):
			staticHandler(ctx)
			//fmt.Println("static handler used!")
		case bytes.HasPrefix(path, apiRoutes):
			apiRouter.Handler(ctx)
		default:
			/*			fmt.Println("Any other request is either ' / ' or a react router link, can just serve index.html.")
						fmt.Println("And there, react router should check for token in local storage otherwise go to login page.")*/
			Index(ctx)
		}
	}

	apiRouter.POST("/api/auth/login", routes.Login)
	apiRouter.POST("/api/auth/register", routes.Register)

	apiRouter.GET("/api/invc/getmany/:ID", routes.GetManyInvoices)
	apiRouter.POST("/api/invc/change/:ID", routes.ChangeLineItems)
	apiRouter.GET("/api/invc/getformitems", routes.GetFormItems)

	defer models.GetDB().Close()

	log.Fatal(fasthttp.ListenAndServe(":9990", middleware.CORS(staticFirst)))
}
