const express = require('express');
const bodyParser = require('body-parser');
const excel = require('exceljs');
const path = require("path");
const methodOverride = require("method-override");



const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(methodOverride('_method'));
app.use(express.urlencoded( {extended:true} ));
app.use(bodyParser.json());

app.get('/',(req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/search', (req, res) => {
    const searchName = req.body.name.toLowerCase();
    const workbook = new excel.Workbook();
    workbook.xlsx.readFile("data1.xlsx").then(() => {
        const worksheet = workbook.getWorksheet(1);
        let result = null;

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            const name = row.getCell(1).value.toLowerCase();
            if (name.includes(searchName)) {
                result = {
                    name: row.getCell(1).value,
                    type: row.getCell(2).value,
                    thickness: row.getCell(3).value,
                    db2: row.getCell(4).value,
                    db1: row.getCell(5).value,
                    db3: row.getCell(6).value,
                    gap: row.getCell(7).value,
                    distance: row.getCell(8).value,
                };
            }
        });

        res.json(result);
   });
});

app.get("/edit/:name", (req, res) => {
    let searchName = req.params.name.toLowerCase();
    const workbook = new excel.Workbook();
    workbook.xlsx.readFile("./data1.xlsx").then(() => {
        const worksheet = workbook.getWorksheet(1);
        let result = null;

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            const name = row.getCell(1).value.toLowerCase();
            if (name.includes(searchName)) {
                result = {
                    name: row.getCell(1).value,
                    type: row.getCell(2).value,
                    thickness: row.getCell(3).value,
                    db2: row.getCell(4).value,
                    db1: row.getCell(5).value,
                    db3: row.getCell(6).value,
                    gap: row.getCell(7).value,
                    distance: row.getCell(8).value,
                };
            }
        });

        res.render("edit.ejs", { result });
   });
})

app.patch("/edit/:name", (req,res) => {
    let searchName = req.params.name.toLowerCase();
    const workbook = new excel.Workbook();
    workbook.xlsx.readFile("./data1.xlsx").then(() => {
        const worksheet = workbook.getWorksheet(1);
        let result = null;

        worksheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
            const name = row.getCell(1).value.toLowerCase();
            if (name.includes(searchName)) {
                row.getCell(1).value = req.params.name;
                row.getCell(2).value = req.body.type;
                row.getCell(3).value = req.body.thickness;
                row.getCell(4).value = req.body.db2;
                row.getCell(5).value = req.body.db1;
                row.getCell(6).value = req.body.db3;
                row.getCell(7).value = req.body.gap;
                row.getCell(8).value = req.body.distance;
                await workbook.xlsx.writeFile('data1.xlsx');
            }
            
        });
        
        res.redirect("/");
   });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
