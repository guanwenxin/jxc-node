const express = require("express");
const app = express();

//引入数据库连接池
var pool = require("./db/db");
//处理post请求
app.use(express.urlencoded({ extended: false }));
//设置静态文件夹
app.use(express.static("public"));
//解决跨域问题
// app.use(cors)
app.get('/re', function (req, res, next) {
  // console.log(req.query);
  pool.query(`select * from user where account='${req.query.account}'`, function (err, data) {
    console.log(data);
    if (data[0]) {
      res.json({ code: 200, data });
    } else {
      res.json({ code: 0, msg: '获取信息失败' });
    }
  })
})

app.post("/register", function (req, res, next) {
  // console.log(req.body.account);
  pool.query(
    `select * from user where account='${req.body.account}'`,
    function (err, data) {
      console.log(data);
      if (data[0]) {
        res.json({
          code: 200,
          msg: "账号密码已经存在!!!!!",
        });
      } else {
        pool.query(
          ` INSERT INTO user (account,password) values ('${req.body.account}','${req.body.password}')`,
          function (err) {
            if (err) {
              console.log("插入失败!!!");
            } else {
              console.log("插入成功!!!");
              res.json({
                code: 200,
                msg: "账号秘密注册成功",
              });
            }
          }
        );
      }
    }
  );
});

app.post("/login", function (req, res, next) {
  // console.log(req.body);
  pool.query(`select * from user where account='${req.body.account}' and password='${req.body.password}'`, function (err, data) {
    if (err) {
      console.log('查询出错', err);
      res.json({
        code: 0,
        msg: '系统出现一些故障,请稍后重试'
      })
    } else {
      if (data[0]) {
        console.log(data);
        res.json({
          code: 200,
          msg: '登陆成功'

        })
      } else {
        res.json({
          code: 0,
          msg: '账号或者密码错误,请重新输入'
        })
      }
    }
  })

})
//更新user信息
app.post('/updateuser', function (req, res, next) {
  // console.log(req.body);
  pool.query(`select * from user where account ='${req.body.account}'`, function (err, data) {
    if (data[0]) {
      pool.query(
        `update user set age=${req.body.age},phone=${req.body.phone},role_name=${req.body.role_name},update_time=${req.body.update_time},user_name=${req.body.user_name} where account='${req.body.account}'`,
        function (err, data) {
          if (err) {
            res.json({
              code: 0,
              msg: '请稍后重试'
            })
          } else {
            res.json({
              code: 200,
              msg: '更新成功'
            })
          }

        }
      );
    }
  })


})

//获取到所有商品的数据信息
app.post('/getgoods', function (req, res, next) {
  // console.log(req.body);
  if (Object.keys(req.body).length) {
    console.log(req.body);
    pool.query(
      `select * from goods where goods_code="${req.body.goods_code}" or name="${req.body.name}" or ppbrand ="${req.body.ppbrand}" or verify_account="${req.body.verify_account}"`
      , function (err, data) {
        if (err) {
          console.log('查询出错');
        } else {
          console.log(data);
          if (data[0]) {
            res.json({
              code: 200,
              data
            })
          } else {
            res.json({
              code: 200,
              msg: '数据库中没有数据'
            })
          }
        }
      });

  } else {
    pool.query(`select * from goods`, function (err, data) {
      if (err) {
        console.log('sql语句,出错了!!!');
      } else {
        if (data[0]) {
          res.json({
            code: 200,
            data
          })
        } else {
          res.json({
            code: 200,
            msg: '数据库中没有数据'
          })
        }
      }

    })
  }
})
//获取商品的品牌
app.get('/getgoodsbrand', function (req, res, next) {
  pool.query(`select ppbrand from goods  `, function (err, data) {
    if (data[0]) {
      res.json({
        code: 200,
        data,
      });
    }
  })
})

//删除某一项商品的信息
app.get('/delgoods', function (req, res, next) {
  // console.log(req.query.goods_code);
  pool.query(`delete from goods where goods_code =${req.query.goods_code}`, function (err, data) {
    if (err) {
      console.log('sql语句出错');
    } else {
      res.json({
        code: 200,
        msg: `编号:${req.query.goods_code}的商品,已经删除成功`
      })
    }
  })

})

//插入商品信息
app.post('/addgoods', function (req, res, next) {
  console.log(req.body);
  pool.query(`select * from goods where goods_code="${req.body.goods_code}" `, function (err, data) {
    if (data[0]) {
      console.log('该商品已经存在了');
    } else {
      pool.query(
        `insert into goods (name,goods_code,account,verify_account,ppbrand,buy_price,goods_num,goods_desc,update_time) values ("${req.body.name}","${req.body.goods_code}","${req.body.account}","${req.body.verify_account}","${req.body.ppbrand}","${req.body.buy_price}","${req.body.goods_num}","质量优秀","${req.body.gofin_time}")`,
        function (err, data) {
          console.log(data);
        }
      );
    }
  })
})

//获取所有员工信息
app.post('/getallpersion', function (req, res, next) {
  console.log(req.body);
  if (Object.keys(req.body).length) {
    console.log("有参数");
  } else {
    pool.query(`select * from user`, function (err, data) {
      if (err) {
        console.log('sql出错了!!!');
      } else {
        res.json({
          data
        })
      }

    })
  }
})

//获取仓库信息
app.post('/getstoreinfo', function (req, res, next) {
  console.log(req.body);
  if (Object.keys(req.body).length) {
    pool.query(
      `select * from store where st_code='${req.body.st_code}'`,
      function (err, data) {
        console.log(data);
        res.json({
          code: 200,
          data,
        });
      }
    );
  } else {
    pool.query(`select * from store`, function (err, data) {
      if (err) {
        console.log("sql出错");
      } else {
        res.json({
          code: 200,
          data
        })
      }
    })
  }
})

//编辑仓库的信息
app.post('/editstoreinfo', function (req, res, next) {
  // console.log(req.body);
  pool.query(
    `update store set  st_name="${req.body.st_name}",st_code="${req.body.st_code}",st_adress="${req.body.st_adress}",st_desc="${req.body.st_des}",update_time="${req.body.update_time}",account="${req.body.account}",user_name="${req.body.user_name}" where store_id="${req.body.store_id}"`,
    function (err, data) {
      if (err) {
        console.log('数据库出错!!');
        res.json({
          code: 0
        })
      } else {
        res.json({
          code: 200
        })
      }
    }
  );
})

//获取采购订单信息
app.post('/getbuyorder', function (req, res, next) {
  // console.log(req.body);
  if (Object.keys(req.body).length) {
    // console.log('有参数');
    pool.query(
      `select * from purchase where goods_code="${req.body.goods_order_num}"or goods_code="${req.body.goods_order_num}"`,
      function (err, data) {
        // console.log(data,123456789);
        res.json({
          code: 200,
          data,
        });
      }
    );
  } else {
    pool.query(`select * from purchase`, function (err, data) {
      res.json({
        code: 200,
        data
      })
    })
  }
})


//添加采购订单信息
app.post('/addbuyorder', function (req, res, next) {
  // console.log(req.body);
  if (Object.keys(req.body).length) {
    // console.log('无参数');
    pool.query(
      `select * from purchase where goods_code='${req.body.goods_code}' or order_num='${req.body.order_num}'`,
      function (err, data) {
        if (data[0]) {
          res.json({
            code: -1
          })
        } else {
          pool.query(`insert into purchase (goods_code,name,production_name,order_num,count,one_price,all_price,order_desc,create_time,create_account,verify_state) values ('${req.body.goods_code}','${req.body.name}','${req.body.production_name}','${req.body.order_num}','${req.body.count}','${req.body.one_price}','${req.body.all_price}','${req.body.order_desc}','${req.body.create_time}','${req.body.create_account}','审核中')`)
          res.json({
            code: 200,
            msg: '插入成功'
          })
        }
      }
    );
  } else {
    console.log('有参数');

  }

})

//编辑订单
app.post('/editbuyorder', function (req, res, next) {
  // console.log(req.body);
  pool.query(
    `update purchase set goods_code="${req.body.goods_code}" ,update_time="${req.body.update_time}" ,name="${req.body.name}",production_name="${req.body.production_name}",order_num="${req.body.order_num}",count="${req.body.count}",one_price="${req.body.one_price}",all_price="${req.body.all_price}",order_desc="${req.body.order_desc}"  where  purchase_id="${req.body.purchase_id}"`,
    function (err, data) {
      res.json({
        code: 200
      })
      // console.log(data);
    }
  );
})

//删除订单信息
app.post("/delbuyorder", function (req, res, next) {
  // console.log(req.body);
  pool.query(
    `DELETE FROM  purchase WHERE purchase_id="${req.body.purchase_id}" `,
    function (err, data) {
      if (err) {
        console.log("sql,出错");
      } else {
        res.json({
          code: 200
        })
      }
    }
  );
})

//订单通过和不通过
app.post("/getbuyorerpass", function (req, res, next) {
  console.log(req.body);

  if (req.body.pass == 1) {
    pool.query(
      `update purchase set mount_account="${req.body.mount_account}",mount_time="${req.body.mount_time}" ,verify_state='通过'  where  purchase_id="${req.body.purchase_id}"`,
      function (err, data) {
        res.json({
          code: 200
        })
        console.log(data);
      }
    );
  } else {
    pool.query(
      `update purchase set mount_account="${req.body.mount_account}",mount_time="${req.body.mount_time}" ,verify_state='不通过'  where  purchase_id="${req.body.purchase_id}"`,
      function (err, data) {
        res.json({
          code: 200
        })
        console.log(data);
      }
    );
  }
})

/* 
  库存模块 
*/
//获取审核通过的采购订单
app.post('/getpassbutorder', function (req, res, next) {
  // console.log(req.body);
  if (Object.keys(req.body).length) {
    pool.query(
      `select * from purchase where goods_code="${req.body.goods_order_num}"or goods_code="${req.body.goods_order_num}" and verify_state="通过"`,
      function (err, data) {
        // console.log(data,123456789);
        res.json({
          code: 200,
          data,
        });
      }
    );
  } else {
    pool.query(
      `select * from purchase where verify_state="通过"`,
      function (err, data) {
        if (data[0]) {
          res.json({
            code: 200,
            data,
          });
        } else {
          console.log("数据库中不存在该值");
        }
      }
    );
  }
})

//入库信息插入模块
app.post("/setstockgoods", function (req, res, next) {
  // console.log(req.body.order_num);
  pool.query(`select * from stock where order_num="${req.body.order_num}"  `, function (err, data) {
    if (data[0]) {
      res.json({
        code: 0,
        msg: '请勿重新提交审核'
      })
    } else {
      pool.query(
        `insert into stock (name,goods_code,buy_price,goods_num,ppbrand,goods_allprice,account,verify_state,order_num) values ("${req.body.name}","${req.body.goods_code}"  ,"${req.body.one_price}","${req.body.count}", "${req.body.production_name}", "${req.body.all_price}","${req.body.account}","审核中","${req.body.order_num}")`, function (err, data) {
          if (err) {
            console.log(err);
            console.log("出错了");
          } else {
            console.log("插入成功");
            res.json({
              code: 200,
              msg: '入库申请提交成功!!!'
            })
          }
        });
    }


  })
})

//撤销提交的审核
app.post("/removestockgoods", function (req, res, next) {
  // console.log(req.body);
  pool.query(`delete from stock where goods_code =${req.body.goods_code}`, function (err, data) {
    // console.log(data);
    if (!data.affectedRows) {
      res.json({
        code: 0,
        msg: '撤销失败,审核已经撤销了'
      })
    } else {
      res.json({
        code: 200,
        msg: '撤销成功'
      })
    }
  })
})

//获取stock表中的库存数据
app.post("/getstocksalldata", function (req, res, next) {
  // console.log(req.body);
  if (Object.keys(req.body).length) {
    pool.query(`select * from stock where goods_code="${req.body.goods_code}"`, function (err, data) {
      if (data[0]) {
        res.json({
          code: 200,
          data
        })
      }
    })
  } else {
    pool.query(`select * from stock`, function (err, data) {
      if (data[0]) {
        res.json({
          code: 200,
          data
        })
      }
    })

  }
})

//同意入库操作
app.post("/agreestock", function (req, res, next) {
  // console.log(req.body,55555);
  pool.query(` select * from stock where verify_state="审核通过" and goods_code="${req.body.goods_code}" `, function (err, data) {
    if (data[0]) {
      res.json({
        code: 0,
        msg: '已经更新过了,请勿反复提交'
      })
    } else {
      pool.query(
        `update stock set verify_state="审核通过",verify_account="${req.body.verify_account}",goin_time="${req.body.gofin_time}" where goods_code="${req.body.goods_code}"`,
        function (err, data) {
          res.json({
            code: 200,
            msg: "商品入库成功!!!!!",
          });

        }
      );

    }
  })
})

//销售价格,数量,申请人写入表中
app.post("/setstocksale", function (req, res, next) {
  // console.log(req.body);
  pool.query(`update stock set sale_price="${req.body.sale_price}",goos_cost="${req.body.sale_price * req.body.sale_num}",sale_num="${req.body.sale_num}" ,goout_time="${req.body.goout_time}",sale_account="${req.body.sale_account}" where goods_code="${req.body.goods_code}"`, function (err, data) {
    console.log(data);
    if (data.affectedRows) {
      pool.query(`update goods set sale_price="${req.body.sale_price}" where goods_code="${req.body.goods_code}"`)
    }
  })
})

//出库数量 和 销售订单确认
app.post("/updategoodsAndsale", function (req, res, next) {
  // console.log(req.body);
  pool.query(`select * from sale where goods_code="${req.body.goods_code}" and sale_num="${req.body.sale_num}"`, function (err, data) {
    if (data[0]) {
      console.log("数据库中已经存在");
      res.json({
        code: 0,
        msg: '您提交的订单已经在审批流程中,请勿重复提交'
      })
    } else {
      console.log("插入数据字段");
      // ,verify_account,verify_time
      pool.query(`insert into sale (goods_code,name,sale_price,sale_num,ppbrand,submit_account,submit_time,verify_state) values (
        "${req.body.goods_code}", "${req.body.name}", "${req.body.sale_price}", "${req.body.sale_num}", "${req.body.ppbrand}",
        "${req.body.submit_account}", "${req.body.submit_time}", "审核中")`, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          // console.log(data);
          res.json({
            code: 200,
            msg: '提交成功!!!!'
          })
        }
      })
    }
  })
})

/* 
  sale 表对应的接口
*/
//获取信息
app.post("/saleallinfo", function (req, res, next) {
  // console.log(req.body);
  pool.query("select * from sale", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      // console.log(data);
      res.json({
        code: 200,
        data
      })
    }
  })
})

// 查询接口
app.post("/salesearchinfo", function (req, res, next) {
  // console.log(req.body);
  if (Object.keys(req.body).length) {
    pool.query(`select * from sale where goods_code="${req.body.goods_code}"`, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        // console.log(data,454646);
        res.json({
          code: 200,
          data
        })
      }
    })
  } else {
    pool.query("select * from sale", function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        res.json({
          code: 200,
          data
        })
      }
    })
  }
})

//通过与不通过接口
app.post("/salepassAndnopass", function (req, res, next) {
  if (req.body.pass == 1) {
    pool.query(`update sale set verify_account="${req.body.verify_account}" , verify_state="通过",veriify_time="${req.body.veriify_time}"
   where goods_code="${req.body.goods_code}" and sale_num="${req.body.sale_num}" and sale_price="${req.body.sale_price}"`, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.json({
          code: 200,
        });
      }
    })
  } else {
    pool.query(`update sale set verify_account="${req.body.verify_account}" , verify_state="不通过",veriify_time="${req.body.veriify_time}"
   where goods_code="${req.body.goods_code}" and sale_num="${req.body.sale_num}" and sale_price="${req.body.sale_price}"`, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.json({
          code: 200,
        });
      }
    })
  }
})




//注册端口号
app.listen(3000, function () {
  console.log("success");
});
