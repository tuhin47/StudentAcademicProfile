var express = require('express');
var router = express.Router();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var url = require('url');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var PDFDocument = require('pdfkit');
var fs = require('fs');
var PdfTable = require('voilab-pdf-table');

// var xoauth2 = require('xoauth2');
// var nodemailersmtptransport=require('nodemailer-smtp-transport');
//var sleep=require('sleep');

mongoose.connect('mongodb://localhost/NodeDemo');
var db = mongoose.connection;



var User = require('../models/user');
var Profile = require('../models/profilemodel');
var Award = require('../models/award');
var Graduation = require('../models/graduation');
var Hobby = require('../models/hobby');
var Interest = require('../models/interest');
var Project = require('../models/project');
var Publication = require('../models/publication');
var SSCResult = require('../models/sschscresult');

// var Profiles=[];
// var Awards=[];
// var Garduations=[];
// var Projects=[];
// var Publications=[];
// var SSCResults=[];


function calculate(result) {
  var cgpa = 0.0;
  var credit = 0.0;
  var total = 0.0;
  for (i = 0; i < result.length; i++) {
    if (parseFloat(result[i].gradepoint) > 0.0) {
      var coursecredit = parseFloat(result[i].coursecredit);
      var gradepoint = parseFloat(result[i].gradepoint);

      console.log('-------coursecredit----->' + coursecredit);
      console.log('-------coursecredit----->' + gradepoint);

      credit = credit + coursecredit;
      total = total + gradepoint * coursecredit;
      console.log(credit);
      console.log(total);
    }
  }
  if (credit > 0)
    cgpa = total / credit;
  return cgpa;

}


/* GET users listing. */
router.get('/', function(req, res, next) {
  var fullname = req.user.firstname + ' ' + req.user.lastname;




  res.render('generatecv', {
    fullname: fullname
  });
});



router.post('/', function(req, res, next) {
  var fullname = req.user.firstname + ' ' + req.user.lastname;
  var filepath = req.body.filepath;
  var path = filepath + '';
  var l = path.length;
  if (path[l - 1] != '/') path = filepath + '/';


  var query1 = {
    username: req.user.username
  };
  console.log('inside post generatecvs');
  Profile.find(query1, function(err1, profile) {
    if (err1) throw err1;
    else {

      Award.find(query1, function(err2, award) {
        if (err2) throw err2;
        else {
          Graduation.find(query1, function(err3, graduation) {
            if (err3) throw err3;
            else {
              SSCResult.find(query1, function(err4, sschscresult) {
                if (err4) throw err4;
                else {
                  Project.find(query1, function(err5, project) {
                    if (err5) throw err5;
                    else {
                      Publication.find(query1, function(err6, publication) {
                        if (err6) throw err6;
                        else {
                          Interest.find(query1, function(err7, interest) {
                            if (err7) throw err7;
                            else {
                              Hobby.find(query1, function(err8, hobby) {
                                if (err8) throw err8;
                                else {
                                  var cgpa = calculate(graduation);
                                  console.log('your cgpa-------->' + cgpa);

                                  console.log(sschscresult);
                                  console.log(hobby);
                                  console.log(interest);
                                  console.log(publication);
                                  console.log(project);
                                  console.log(award);


                                  var nameheader = 18;
                                  var localheader = 11;
                                  var localdata = 9;
                                  var doc = new PDFDocument();

                                  doc.pipe(fs.createWriteStream(path + '' + fullname + '.pdf'));
                                  var l = fullname.length;
                                  doc.fontSize(nameheader);
                                  doc.font('Times-Roman')
                                    .text('' + fullname, {
                                      align: 'center'

                                    });

                                  doc.fontSize(localdata);

                                  doc.font('Times-Roman')
                                    .text('     Address: ' + profile[0].temporaryaddress+'    Email: ' + profile[0].email+ '    Contact No: ' + profile[0].phonenumber, {
                                      align: 'center',


                                    });

                                  // doc.font('Times-Roman')
                                  //   .text('        Email:        ' + profile[0].email, {
                                  //     align: 'center'
                                  //
                                  //   });
                                  //
                                  // doc.font('Times-Roman')
                                  //   .text('Contact No:        ' + profile[0].phonenumber, {
                                  //     align: 'center'
                                  //
                                  //   });
                                  doc.moveDown(2);
                                  doc.fontSize(localheader);
                                  doc.font('Times-Roman')
                                    .text('Personal Profile', {
                                      align: 'left',
                                      bold: true
                                    });

                                  var overview = profile[0].overview;
                                  doc.fontSize(localdata);
                                  doc.font('Times-Roman')
                                    .text('' + overview, {
                                      align: 'left'

                                    });

                                  doc.moveDown(1);
                                  doc.fontSize(localheader);
                                  doc.font('Times-Roman')
                                    .text('Education', {
                                      align: 'left',
                                      bold: true
                                    });

                                  doc.fontSize(localdata);

                                  for (var i = 0; i < sschscresult.length; i++) {
                                    if (sschscresult[i].examtype == 'SSC') {

                                      doc.font('Times-Roman').text('SSC    ' + sschscresult[i].institution + '    ' +
                                        sschscresult[i].passedyear + '    GPA:' + sschscresult[i].gpa, {
                                          align: 'center',
                                        });
                                    } else if (sschscresult[i].examtype == 'HSC') {
                                      doc.font('Times-Roman').text('HSC    ' + sschscresult[i].institution + '    ' +
                                        sschscresult[i].passedyear + '    GPA:' + sschscresult[i].gpa, {
                                          align: 'center',
                                        });
                                    } else if (sschscresult[i].examtype == 'Graduation') {
                                      doc.font('Times-Roman').text('Graduation    ' + sschscresult[i].institution + '    ' +
                                        sschscresult[i].passedyear + '    CGPA:' + sschscresult[i].gpa, {
                                          align: 'center',
                                        });
                                    }
                                  }


                                  // projects is here ---------------->>>
                                  doc.moveDown(1);
                                  doc.fontSize(localheader);
                                  doc.font('Times-Roman')
                                    .text('Projects', {
                                      align: 'left',
                                      bold: true
                                    });

                                  doc.fontSize(localdata);
                                  // doc.font('Times-Roman').text('        Project Title    ', {
                                  //   align: 'left',
                                  //   continued:true
                                  // });
                                  // doc.moveDown(1);
                                  // doc.font('Times-Roman').text('        Project Title    ', {
                                  //   align: 'right'
                                  // });
                                  doc.moveDown(1);

                                  for (i = 0; i < project.length; i++) {
                                    doc.font('Times-Roman').text(''+project[i].projecttitle, {
                                      align: 'left',
                                      continued:true
                                    });
                                    doc.moveDown(1);
                                    doc.font('Times-Roman').text('        -'+project[i].projectdetails, {
                                      align: 'right'
                                    });
                                    doc.moveDown(1);
                                  }

                                  doc.moveDown(1);
                                  doc.fontSize(localheader);
                                  doc.font('Times-Roman')
                                    .text('Publications', {
                                      align: 'left',
                                      bold: true
                                    });

                                  doc.fontSize(localdata);

                                  doc.moveDown(1);

                                  for (i = 0; i < publication.length; i++) {
                                    doc.fontSize(localheader);
                                    doc.font('Times-Roman').text(''+publication[i].publicationtitle, {
                                      align: 'left',
                                      continued:true
                                    });
                                    doc.moveDown(1);
                                    doc.fontSize(localdata);
                                    doc.font('Times-Roman').text(publication[i].publicationplace+'--'+publication[i].publicationshort+'--'+publication[i].publicationurl, {
                                      align: 'right'
                                    });
                                    doc.moveDown(1);
                                  }

                                  doc.moveDown(1);
                                  doc.fontSize(localheader);
                                  doc.font('Times-Roman')
                                    .text('Interests', {
                                      align: 'left',
                                      bold: true
                                    });

                                  doc.fontSize(localdata);

                                  doc.moveDown(1);

                                  for (i = 0; i <interest.length; i++) {
                                    doc.fontSize(localheader);
                                    doc.font('Times-Roman').text(''+interest[i].interestabout, {
                                      align: 'left',
                                      continued:true
                                    });
                                    doc.moveDown(1);
                                    doc.fontSize(localdata);
                                    doc.font('Times-Roman').text('--'+interest[i].interestshortails+'--'+interest[i].interestnurl, {
                                      align: 'right'
                                    });
                                    doc.moveDown(1);
                                  }







                                  // create a PDF from PDFKit, and a table from PDFTable

                                  // var table = new PdfTable(doc, {
                                  //   bottomMargin: 30
                                  // });
                                  //
                                  // table
                                  //   // add some plugins (here, a 'fit-to-width' for a column)
                                  //   .addPlugin(new(require('voilab-pdf-table/plugins/fitcolumn'))({
                                  //     column: 'description'
                                  //   }))
                                  //   // set defaults to your columns
                                  //   .setColumnsDefaults({
                                  //     headerBorder: 'B',
                                  //     align: 'right'
                                  //   })
                                  //   // add table columns
                                  //   .addColumns([{
                                  //       id: 'description',
                                  //       header: 'Product',
                                  //       align: 'left'
                                  //     },
                                  //     {
                                  //       id: 'quantity',
                                  //       header: 'Quantity',
                                  //       align: 'left'
                                  //     },
                                  //     {
                                  //       id: 'price',
                                  //       header: 'Price',
                                  //       align: 'left'
                                  //     },
                                  //     {
                                  //       id: 'total',
                                  //       header: 'Total',
                                  //       align: 'left'
                                  //       // renderer: function(tb, data) {
                                  //       //   return 'CHF ' + data.total;
                                  //       // }
                                  //     }
                                  //   ]);
                                  //   // add events (here, we draw headers on each new page)
                                  //
                                  //
                                  // // if no page already exists in your PDF, do not forget to add one
                                  //
                                  // // draw content, by passing data to the addBody method
                                  // table.addBody([{
                                  //     description: 'Product 1',
                                  //     quantity: 1,
                                  //     price: 20.10,
                                  //     total: 20.10
                                  //   },
                                  //   {
                                  //     description: 'Product 2',
                                  //     quantity: 4,
                                  //     price: 4.00,
                                  //     total: 16.00
                                  //   },
                                  //   {
                                  //     description: 'Product 3',
                                  //     quantity: 2,
                                  //     price: 17.85,
                                  //     total: 35.70
                                  //   }
                                  // ]);




                                  // doc.moveTo(0, 100)
                                  //   .lineTo(200, 100)
                                  //   .stroke();
                                  //





                                  doc.end();



                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }

          });

        }

      });

    }
  });




  console.log('before pipe');



  // console.log('after pipe');
  // doc.font('fonts/PalatinoBold.ttf')
  //    .fontSize(25)
  //    .text('Some text with an embedded font!', 100, 100);
  //
  // console.log('before addPage');
  // doc.addPage()
  //    .fontSize(25)
  //    .text('Here is some vector graphics...', 100, 100);
  // console.log('after addPage');
  //
  // doc.save()
  //    .moveTo(100, 150)
  //    .lineTo(100, 250)
  //    .lineTo(200, 250)
  //    .fill("#FF3300");
  //
  //
  // doc.scale(0.6)
  //    .translate(470, -380)
  //    .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
  //    .fill('red', 'even-odd')
  //    .restore();



  console.log('----------->   pdf created');
  res.redirect('/profile');

});



module.exports = router;
