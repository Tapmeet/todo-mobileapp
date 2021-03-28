import SQLite from 'react-native-sqlite-storage';
import {Alert} from 'react-native'
SQLite.DEBUG(true);
SQLite.enablePromise(true);
const database_name = 'CCoachDatabase1.db';
const database_version = '1.0';
const database_displayname = 'SQLite React Offline Database';
const database_size = 200000;
import pills from './Images/pills.png';
// const toBase64 = file => new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = error => reject(error);
// });
//  const toBase64 = async(file) => await new Promise((resolve, reject) => {
// //     const reader = new FileReader();
// //     reader.readAsDataURL(file);
// //     reader.onload = () =>{resolve(reader.result); console.log("base64 image: "+ reader.result)};
// //     reader.onerror = error => reject(error);
// // });
// function toBase64(url, callback) {
//   var xhr = new XMLHttpRequest();
//   xhr.onload = function() {
//     var reader = new FileReader();
//     reader.onloadend = function() {
//       callback(reader.result);
//     };
//     reader.readAsDataURL(xhr.response);
//   };
//   xhr.open('GET', url);
//   xhr.responseType = 'blob';
//   xhr.send();
// }

export default class SQLdatabase {
  // let imageURL = './Images/pills.png'

  initDB() {
    console.log('this.initDB() is executed ');
    let db;
    return new Promise(resolve => {
      console.log('Plugin integrity check ...');
      SQLite.echoTest()
        .then(() => {
          console.log('Integrity check passed ...');
          console.log('Opening database ...');
          SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
          )
            .then(DB => {
              db = DB;
              console.log('Database OPEN');
              db.executeSql('SELECT 1 FROM Product LIMIT 1')
                .then(() => {
                  console.log('Database is ready ... executing query ...');
                })
                .catch(error => {
                  console.log('Received error: ', error);
                  console.log('Database not yet ready ... populating data');
                  // db.transaction(tx => {
                  //   tx.executeSql(
                  //     'CREATE TABLE IF NOT EXISTS TaskRepeat (Id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT,interval INTEGER,isActive INTEGER)',
                  //   );
                  // })
                  //   .then(() => {
                  //     console.log('taskRepeat Table created successfully');
                  //   })
                  //   .catch(error => {
                  //     console.log(error);
                  //   });
                  //
                  // db.transaction(tx => {
                  //   tx.executeSql(
                  //     'CREATE TABLE IF NOT EXISTS AddTo (Id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT,isActive integer)',
                  //   );
                  // })
                  //   .then(() => {
                  //     console.log('AddTo Table created successfully');
                  //   })
                  //   .catch(error => {
                  //     console.log(error);
                  //   });
                  //
                  // db.transaction(tx => {
                  //   tx.executeSql(
                  //     'CREATE TABLE IF NOT EXISTS Progress (Id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT,image TEXT,isActive INTEGER)',
                  //   );
                  // })
                  //   .then(() => {
                  //     console.log('progress  Table created successfully');
                  //   })
                  //   .catch(error => {
                  //     console.log(error);
                  //   });
                  // //
                  // db.transaction(tx => {
                  //   tx.executeSql(
                  //     'CREATE TABLE IF NOT EXISTS Priority (Id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT,color TEXT,isActive INTEGER)',
                  //   );
                  // })
                  //   .then(() => {
                  //     console.log('Priority Table created successfully');
                  //   })
                  //   .catch(error => {
                  //     console.log(error);
                  //   });

                  db.transaction(tx => {
                    tx.executeSql(
                      'CREATE TABLE IF NOT EXISTS TaskIcon (Id INTEGER PRIMARY KEY AUTOINCREMENT, icon TEXT, customImage integer,isActive INTEGER)',
                    );
                  })
                    .then(() => {
                      console.log('taskIcon Table created successfully');
                    })
                    .catch(error => {
                      console.log(error);
                    });
                  //
                  db.transaction(tx => {
                    tx.executeSql(
                      'CREATE TABLE IF NOT EXISTS Goals (Id INTEGER PRIMARY KEY AUTOINCREMENT, goal TEXT,refTaskIcon INTEGER,isCompleted INTEGER,accomplishedPercentage INTEGER,isActive INTEGER)',
                    );
                  })
                    .then(() => {
                      console.log('Goals Table created successfully');
                    })
                    .catch(error => {
                      console.log(error);
                    });
                  //
                  db.transaction(tx => {
                    tx.executeSql(
                      'CREATE TABLE IF NOT EXISTS Task (Id INTEGER PRIMARY KEY AUTOINCREMENT,task TEXT,taskDescription TEXT , refGoal INTEGER ,' +
                        'refAddTo INTEGER,startDate TEXT,refTaskRepeat INTEGER,refTaskRepeatEnd INTEGER,' +
                        'endOnDate TEXT,refProgress INTEGER,refPriority INTEGER,orderIndex INTEGER,isCompleted INTEGER,isActive INTEGER)',
                    );
                  })
                    .then(() => {
                      console.log('Task Table created successfully');
                    })
                    .catch(error => {
                      console.log(error);
                    });

                  db.transaction(tx => {
                    tx.executeSql(
                      'CREATE TABLE IF NOT EXISTS TaskOnDate (Id INTEGER PRIMARY KEY AUTOINCREMENT,refTask INTEGER,date TEXT,completedDate TEXT,isCompleted INTEGER,notifyId TEXT,isNotificationRegistered INTEGER,isNotificationCancel INTEGER, isActive INTEGER)',
                    );
                  })
                    .then(() => {
                      console.log('Task Table created successfully');
                    })
                    .catch(error => {
                      console.log(error);
                    });
                  // db.transaction(tx => {
                  //   tx.executeSql(
                  //     'CREATE TABLE IF NOT EXISTS TaskRepeatEnd (Id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,isActive INTEGER)',
                  //   );
                  // })
                  //   .then(() => {
                  //     console.log('TaskRepeatEnd Table created successfully');
                  //   })
                  //   .catch(error => {
                  //     console.log(error);
                  //   });

                  db.transaction(tx => {
                    tx.executeSql(
                      'CREATE TABLE IF NOT EXISTS Reminder (Id INTEGER PRIMARY KEY AUTOINCREMENT,time TEXT,day TEXT,notifyId TEXT,isActive INTEGER)',
                    );
                  })
                    .then(() => {
                      console.log('Reminder Table created successfully');
                    })
                    .catch(error => {
                      console.log(error);
                    });
                });
              resolve(db);
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log('echoTest failed - plugin not functional');
        });
    });
    // this.insertInToTaskRepeat()
  }
  insertInToTaskRepeat() {
    return new Promise(resolve => {
      const repeatDay = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            console.log('insertInToTaskRepeat is executed');
            tx.executeSql('SELECT* FROM TaskRepeat tr', []).then(
              ([tx, results]) => {
                console.log('Query completed');
                var len = results.rows.length;
                if (len <= 0) {
                  var tr = [
                    {title: 'Never', interval: 0},
                    {title: 'Every Days', interval: 1},
                    {title: 'Every Week', interval: 7},
                    {title: 'Every 2 Week', interval: 14},
                    {title: 'Every Month', interval: 30},
                    {title: 'Every Year', interval: 365},
                  ];
                  for (let i = 0; i < tr.length; i++) {
                    let data = {
                      Id: i + 1,
                      title: tr[i].title,
                      interval: tr[i].interval,
                    };
                    db.transaction(tx => {
                      tx.executeSql(
                        'INSERT INTO TaskRepeat VALUES (?, ?,?,?)',
                        [data.Id, data.title, data.interval, 1],
                      ).then(([tx, results]) => {
                        resolve(results);
                      });
                    })
                      .then(result => {
                        this.closeDatabase(db);
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  }
                }
                console.log(repeatDay);
                resolve(repeatDay);
              },
            );
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  insertAddTo() {
    return new Promise(resolve => {
      const addTo = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            console.log('insertAddTo is executed');
            tx.executeSql('SELECT* FROM AddTo', []).then(([tx, results]) => {
              console.log('Query completed');
              var len = results.rows.length;
              if (len <= 0) {
                var tr = [
                  'To-Do',
                  'Calendar',
                  'To-Do and Calendar',
                  'No Thanks',
                ];
                for (let i = 0; i < tr.length; i++) {
                  let data = {
                    Id: i + 1,
                    title: tr[i],
                  };
                  db.transaction(tx => {
                    tx.executeSql('INSERT INTO AddTo VALUES (?, ?,?)', [
                      data.Id,
                      data.title,
                      1,
                    ]).then(([tx, results]) => {
                      resolve(results);
                    });
                  })
                    .then(result => {
                      this.closeDatabase(db);
                    })
                    .catch(err => {
                      console.log(err);
                    });
                }
              }
              console.log(addTo);
              resolve(addTo);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  insertInToProgress() {
    return new Promise(resolve => {
      const progress = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            console.log('insertInToProgress is executed');
            tx.executeSql('SELECT* FROM Progress', []).then(([tx, results]) => {
              console.log('Query completed');
              var len = results.rows.length;
              console.log('insertInToProgress len:' + len);
              if (len <= 0) {
                var tr = [
                  {
                    title: 'Not Started',
                    Img:
                      'data:image/png;base64,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',
                  },
                  {
                    title: 'Started',
                    Img:
                      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABICAYAAACOVhllAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAASOSURBVHgB7Zw9bNNAFMf/qbrQUilIZIClYUGChSLYcTeYgJEBFAQSIyAY+WjFCqLdgKUtDExIVAyw4XYG0QkESy8LDEUiUmkZzXv2ObJd2znbySVO7ic9/HVU0V/v3fe7CjTiOE6VLmwzZHWyaflclc9VWbQauI/SihgjyJryWcjrRqVSaUEDFfQIKdiMtBNkFjyhdOKKKa9r8r7r4nZVRBLOossZeIJZGFxYRBtSWBLVRgEKiyiFO0/WQHIIlgGbbJWvJOpGlv+YS0QZqjfJbqHcwiUhyBbIVklQ0alwJhGl1z3EYIdqNxFkiyTkQlqhjiIGvK4B/Q3DoPCW7GpSg5Qo4giEbFa4npyNEzJWRBm2Sxhdz0uCG53Z6Mux6AsSkOu8jzACxmGRPk+jL0OeKAWcg6ETs8G+ZVtEErABL4QNnQmFtSsiCViHCeGstL3RrxMvwAiYlYf+je+JmzAi5uEAd3nGSEB/WsqQHe5Du+FswZAXnrFyRTwDQ16431gdRx9C2bp2Hdu7u7BOn8KTO3dQcmb6IiILeOncWax9+ox3a+voBYdrB3Hq+HFowBWxL5MLUxOT+Lm1hblnz/Z8Ozo97X4P8vffDr6LpnLZ/fsm8eKBFhFPjGMAuXvl8h4v+vT1G248eqRUlr27Vx4ew8wYDEWpsogChiIYEbuAK2IThkJwwyLQJ7hl5YYhyrv1dTx/8yb07vDBGl7cv6dU9tfWbxyi8pposYhatlrEwV2TuL4ci/KZWuMQxyrqZQmNIgpTJxanZUQsjvHELtAc50lFmokQ6MsYescdiUThRoTrwNC7Wk25LA/7NLLhD/t4YboOzfxoNmOHctwKqw774spqHvZt+MM+01fMR4s3PPkiZtpKZmjD+xvbq302DHmw+R9XRLkHr2+d7hLjRvB45IWFAeDxy1eYmpwIvdve2VUuq2nY1/IX74Micnxb0EjS2LkbHKr1XMQ1/yYooo3Aqr4OksbOJeGtf9Oe2ZauaepFdWz/Jro8sAqDCnZwQ3xURBsGFVaCD1EROc5NSHfGDj6ERJSbus3oJZ3laG5L3JLpPAxprERf7BHRtNKpiLg8wKTF+0UY4oiN0iQROQ3LeGMY9sLluA+xIsoGxnhjmJWkD2l7cXrqjbw0UCIE2XLSx0QRe+mNUxMTeP3+A0rESlrKbmqWqUyS5MyCUU6QFPByVkRSgdStddIbR73fON8pcVwpaZw8krOtLIwe3CIf6VRIVcQ6Xb5g9ML6iMrxBUo7ZeUfGrWwnlcRkMl6BgR3e25i+FEKY5/Mp5GMQP3IjelJVS9k8mx8v4jh3gR1O4uATGYRZbeHE6YFho/5pPFxGrlPaBrCRHM+/+YWclDomKshEpKHdQ3kpFAykKw7TiJlhqMELBYRsKuQV8455SNX+EYpFM5RnPKEt4B3bJWNQYSErJItOIML/7ZyDF/ph9bJNp3BYcnxIqV80A9vOP0T84/j1dXDMXGiUUwWbsnxDo0bTnok5hfHq+vcgy2gma62zllw9p5+XEf4uOggwSOhBbxsB77a8GZc+rq8+x99bqfiK5+51AAAAABJRU5ErkJggg==',
                  },
                  {
                    title: 'Accomplished',
                    Img:
                      'data:image/png;base64,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',
                  },
                ];
                for (let i = 0; i < tr.length; i++) {
                  let data = {
                    Id: i + 1,
                    title: tr[i].title,
                    image: tr[i].Img,
                  };
                  db.transaction(tx => {
                    tx.executeSql('INSERT INTO Progress VALUES (?, ?,?,?)', [
                      data.Id,
                      data.title,
                      data.image,
                      1,
                    ]).then(([tx, results]) => {
                      console.log(results);
                      resolve(results);
                    });
                  })
                    .then(result => {
                      this.closeDatabase(db);
                    })
                    .catch(err => {
                      console.log(err);
                    });
                }
              }
              console.log(progress);
              resolve(progress);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  //
  insertInToPriority() {
    return new Promise(resolve => {
      const priority = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            console.log('insertInToPriority is executed');
            tx.executeSql('SELECT* FROM Priority', []).then(([tx, results]) => {
              console.log('Query completed');
              var len = results.rows.length;
              console.log('insertInToPriority len:' + len);
              if (len <= 0) {
                var tr = [
                  {title: 'Going very well/Low Priority', clr: 'green'},
                  {title: 'Going OK/Medium Priority', clr: 'yellow'},
                  {title: 'Not Getting done/ High Priority', clr: 'red'},
                ];
                for (let i = 0; i < tr.length; i++) {
                  let data = {
                    Id: i + 1,
                    title: tr[i].title,
                    color: tr[i].clr,
                  };
                  db.transaction(tx => {
                    tx.executeSql('INSERT INTO Priority VALUES (?, ?,?,?)', [
                      data.Id,
                      data.title,
                      data.color,
                      1,
                    ]).then(([tx, results]) => {
                      resolve(results);
                    });
                  })
                    .then(result => {
                      this.closeDatabase(db);
                    })
                    .catch(err => {
                      console.log(err);
                    });
                }
              }
              console.log('');
              //resolve(priority);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  //
  insertInToTaskRepeatEnd() {
    return new Promise(resolve => {
      const priority = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            console.log('insertInToTaskRepeatEnd is executed');
            tx.executeSql('SELECT* FROM TaskRepeatEnd', []).then(
              ([tx, results]) => {
                console.log('Query completed');
                var len = results.rows.length;
                if (len <= 0) {
                  var tr = ['Never', 'OnDate'];
                  for (let i = 0; i < tr.length; i++) {
                    let data = {
                      Id: i + 1,
                      title: tr[i],
                    };
                    db.transaction(tx => {
                      tx.executeSql(
                        'INSERT INTO TaskRepeatEnd VALUES (?,?, ?)',
                        [data.Id, data.title, 1],
                      ).then(([tx, results]) => {
                        resolve(results);
                      });
                    })
                      .then(result => {
                        this.closeDatabase(db);
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  }
                }
                console.log('');
                //resolve(priority);
              },
            );
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  insertInToTaskIcon(dataList) {
    console.log('insertInToTaskIcon 1 is executed',dataList);
    return new Promise(resolve => {
      const priority = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            console.log('insertInToTaskIcon is executed');
            // tx.executeSql('SELECT* FROM TaskIcon', []).then(([tx, results]) => {
            //     console.log('Query completed');
                let len = dataList.length;
                console.log("length :",len);
              if (len == 1) {
                 let data = dataList[0];
                db.transaction(tx => {
                  tx.executeSql('INSERT INTO TaskIcon VALUES (?, ?,?,?)', [
                    data.Id,
                    data.icon,
                    data.customImage,
                    1,
                  ]).then(([tx, results]) => {
                    resolve(results);
                  });
                })
                  .then(result => {
                    console.log('Task Icon insert Query completed' + data.icon);
                    this.closeDatabase(db);
                  })
                  .catch(err => {
                    console.log(err);
                  });
              } else {
                // if (len <= 0) {
                  dataList.forEach(d=>{
                    let data = d;
                    db.transaction(tx => {
                      tx.executeSql('INSERT INTO TaskIcon VALUES (?, ?,?,?)', [
                        data.Id,
                        data.icon,
                        data.customImage,
                        1,
                      ]).then(([tx, results]) => {
                        resolve(results);
                      });
                    })
                        .then(result => {
                          console.log(
                              'Task Icon insert Query completed' + data.icon,
                          );
                          this.closeDatabase(db);
                        })
                        .catch(err => {
                          console.log(err);
                        });
                  })

                // } else {
                //   console.log('length of TaskIcon table is greater than 0');
                // }
              }
              console.log('');
              //resolve(priority);
            // });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  dropTable() {
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql('DROP TABLE Priority');
          })
            .then(() => {
              console.log(' Priority table is drop');
            })
            .catch(error => {
              console.log('Priority table is not drop');
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  insertInToReminder(data) {
    console.log('this.insertInToReminder() is executed ');
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql('INSERT INTO Reminder VALUES (?, ?,?,?,?)', [
              data.Id,
              data.time,
              data.day,
              data.notifyId,
              1,
            ]).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              console.log('Reminder insert Query completed');
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  updateReminder(id, data) {
    console.log('this.updateReminder() is executed ');
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'UPDATE Reminder SET time = ?,day =?, isActive = ? WHERE Id = ?',
              [data.time, data.day, data.isActive, id],
            ).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  getReminder() {
    console.log('this.getTaskReminder() is executed ');
    return new Promise(resolve => {
      const reminder = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT r.Id,r.time,r.day,r.notifyId,r.isActive FROM Reminder r',
              [],
            ).then(([tx, results]) => {
              console.log('Query completed');
              var len = results.rows.length;
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                console.log(`ID: ${row.Id}, time: ${row.time}`);
                const {Id, time, day,notifyId,isActive} = row;
                reminder.push({
                  Id,
                  time,
                  day,
                  notifyId,
                  isActive,
                });
              }
              console.log(reminder);
              resolve(reminder);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  insertInToGoals(data) {
    console.log('this.insertInToGoals() is executed ');
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql('INSERT INTO Goals VALUES (?, ?,?,?,?,?)', [
              data.Id,
              data.goal,
              data.refTaskIcon,
              data.isCompleted,
              data.accomplishedPercentage,
              1,
            ]).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              console.log('Goals insert Query completed' + data.goal);
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  updateGoals(id, data) {
    console.log('this.updateGoals() is executed ', data);
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'UPDATE Goals SET goal = ?,refTaskIcon =?,isCompleted =?, accomplishedPercentage = ?, isActive = ? WHERE Id = ?',
              [
                data.goal,
                data.refTaskIcon,
                data.isCompleted,
                data.accomplishedPercentage,
                data.isActive,
                data.Id,
              ],
            ).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              console.log('update query executed successfully ');
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  updateTasks(id, data) {
    console.log('this.updateTasks() is executed', data);
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'UPDATE Task SET task = ?,taskDescription=?, refGoal = ?, refAddTo = ?,startDate=?,refTaskRepeat=?,' +
                'endOnDate=?,refTaskRepeatEnd=?,refProgress=?,refPriority=?,orderIndex=?,isActive=? WHERE Id = ?',
              [
                data.task,
                data.taskDescription,
                data.refGoal,
                data.refAddTo,
                data.startDate,
                data.refTaskRepeat,
                data.endOnDate,
                data.refTaskRepeatEnd,
                data.refProgress,
                data.refPriority,
                data.orderIndex,
                data.isActive,
                id,
              ],
            ).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  updateTasksList(dataList) {
    console.log('this.updateTasks() is executed', dataList);
    return new Promise(resolve => {
      this.initDB()
          .then(db => {
            for (let i = 0; i < dataList.length; i++) {
              let data = dataList[i];
              console.log("updateTask :",data);
                db.transaction(tx => {
                tx.executeSql(
                    'UPDATE Task SET task = ?,taskDescription=?, refGoal = ?, refAddTo = ?,startDate=?,refTaskRepeat=?,' +
                    'endOnDate=?,refTaskRepeatEnd=?,refProgress=?,refPriority=?,orderIndex=?,isActive=? WHERE Id = ?',
                    [
                      data.task,
                      data.taskDescription,
                      data.refGoal,
                      data.refAddTo,
                      data.startDate,
                      data.refTaskRepeat,
                      data.endOnDate,
                      data.refTaskRepeatEnd,
                      data.refProgress,
                      data.refPriority,
                      data.orderIndex,
                      data.isActive,
                      data.Id,
                    ],
                ).then(([tx, results]) => {
                  resolve(results);
                });
              })
                  .then(result => {
                    this.closeDatabase(db);
                  })
                  .catch(err => {
                    console.log(err);
                  });
            }
          })
          .catch(err => {
            console.log(err);
          });
    });
  }
  insertInToTasks(data) {
    console.log('this.insertInToTasks() is executed :', data);
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            console.log('insertInToTasks is executed', data);
            tx.executeSql(
              'INSERT INTO Task VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
              [
                data.Id,
                data.task,
                data.taskDescription,
                data.refGoal,
                data.refAddTo,
                data.startDate,
                data.refTaskRepeat,
                data.refTaskRepeatEnd,
                data.endOnDate,
                data.refProgress,
                data.refPriority,
                data.orderIndex,
                0,
                1,
              ],
            ).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  updateTaskOnDate(id, data) {
    console.log('this.updateTasks() is executed', data);
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'UPDATE TaskOnDate SET refTask = ?,date=?,completedDate=?,isCompleted =?,notifyId = ?,isNotificationRegistered =?,isNotificationCancel =? ,isActive=? WHERE Id = ?',
              [
                data.refTask,
                data.date,
                data.completedDate,
                data.isCompleted,
                data.notifyId,
                data.isNotificationRegistered,
                data.isNotificationCancel,
                data.isActive,
                id,
              ],
            ).then(([tx, results]) => {
              console.log(results);
              resolve(results);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  updateTaskOnDateList(dateList) {
    console.log('this.updateTasks() is executed', dateList);
    return new Promise(resolve => {
      this.initDB()
          .then(db => {
            for (let i = 0; i < dateList.length; i++) {
              let data = dateList[i];
              console.log("updateTask :", data);
              db.transaction(tx => {
                tx.executeSql(
                    'UPDATE TaskOnDate SET refTask = ?,date=?,completedDate=?,isCompleted =?,notifyId = ?,isNotificationRegistered =?,isNotificationCancel =? ,isActive=? WHERE Id = ?',
                    [
                      data.refTask,
                      data.date,
                      data.completedDate,
                      data.isCompleted,
                      data.notifyId,
                      data.isNotificationRegistered,
                      data.isNotificationCancel,
                      data.isActive,
                      data.Id,
                    ],
                ).then(([tx, results]) => {
                  console.log(results);
                  resolve(results);
                });
              })
                  .then(result => {
                    this.closeDatabase(db);
                  })
                  .catch(err => {
                    console.log(err);
                  });
            }
          })
          .catch(err => {
            console.log(err);
          });
    });
  }
  deleteTaskOnDate(id) {
    console.log('this.deleteTaskOnDate() is executed', id);
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql('delete from TaskOnDate where Id = ? ', [id]).then(
              ([tx, results]) => {
                resolve(results);
              },
            );
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  // 'CREATE TABLE IF NOT EXISTS TaskOnDate (Id INTEGER PRIMARY KEY AUTOINCREMENT,refTask INTEGER,date TEXT,completedDate TEXT,isCompleted INTEGER,isActive INTEGER)'
  // tx.executeSql('INSERT INTO AddTo VALUES (?, ?,?)', [data.Id,data.title,1]).then(([tx, results]) => {
  insertInToTaskOnDate(dateData) {
    console.log('this.insertInToTaskOnDate() is executed :', dateData);
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          // Alert.alert('insertInToTaskOnDate length :',dateData.length.toString());
          for (let i = 0; i < dateData.length; i++) {
            let data = dateData[i];
            db.transaction(tx => {
              console.log('insertInToTaskOnDate is executed', data);
              // Alert.alert('insertInToTaskOnDate',JSON.stringify(data));
              tx.executeSql('INSERT INTO TaskOnDate VALUES (?, ?,?,?,?,?,?,?,?)', [
                data.Id,
                data.refTask,
                data.date,
                data.completedDate,
                data.isCompleted,
                data.notifyId,
                data.isNotificationRegistered,
                data.isNotificationCancel,
                1,
              ]).then(([tx, results]) => {
                resolve(results);
              });
            })
              .then(result => {
                this.closeDatabase(db);
              })
              .catch(err => {
                console.log(err);
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  getTaskRepeat() {
    console.log('this.getTaskRepeat() is executed ');
    return new Promise(resolve => {
      const repeatDay = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT tr.Id,tr.title,tr.interval,tr.isActive FROM TaskRepeat tr',
              [],
            ).then(([tx, results]) => {
              console.log('Query completed');
              var len = results.rows.length;
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                console.log(`Prod ID: ${row.Id}, Prod Name: ${row.title}`);
                const {Id, title, interval, isActive} = row;
                repeatDay.push({
                  Id,
                  title,
                  interval,
                  isActive,
                });
              }
              console.log(repeatDay);
              resolve(repeatDay);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  getTaskRepeatEnd() {
    console.log('this.getTaskRepeatEnd() is executed ');
    return new Promise(resolve => {
      const repeatEndDay = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT tr.Id,tr.title,tr.isActive FROM TaskRepeatEnd tr',
              [],
            ).then(([tx, results]) => {
              console.log('Query completed');
              var len = results.rows.length;
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                console.log(`Prod ID: ${row.Id}, Prod Name: ${row.title}`);
                const {Id, title, isActive} = row;
                repeatEndDay.push({
                  Id,
                  title,
                  isActive,
                });
              }
              console.log(repeatEndDay);
              resolve(repeatEndDay);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  getProgress() {
    console.log('this.getTaskRepeat() is executed ');
    return new Promise(resolve => {
      const progress = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT pr.Id,pr.title,pr.image,pr.isActive FROM Progress pr',
              [],
            ).then(([tx, results]) => {
              console.log('Query completed');
              var len = results.rows.length;
              console.log('length of progress:' + len);
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                console.log(`Pro ID: ${row.Id}, Pro Name: ${row.title}`);
                const {Id, title, image, isActive} = row;
                progress.push({
                  Id,
                  title,
                  image,
                  isActive,
                });
              }
              console.log(progress);
              resolve(progress);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  //
  getPriority() {
    console.log('this.getPriority() is executed ');
    return new Promise(resolve => {
      const priority = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT pt.Id,pt.title,pt.color,pt.isActive FROM Priority pt',
              [],
            ).then(([tx, results]) => {
              console.log('Query completed');
              var len = results.rows.length;
              console.log('length of priority:' + len);
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                console.log(`Pri ID: ${row.Id}, Pri Name: ${row.title}`);
                const {Id, title, color, isActive} = row;
                priority.push({
                  Id,
                  title,
                  color,
                  isActive,
                });
              }
              console.log(priority);
              resolve(priority);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  //
  getAddTo() {
    console.log('this.getTaskRepeat() is executed ');
    return new Promise(resolve => {
      const addto = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT at.Id,at.title,at.isActive FROM AddTo at',
              [],
            ).then(([tx, results]) => {
              console.log('Query completed');
              var len = results.rows.length;
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                console.log(`at ID: ${row.Id}, at Name: ${row.title}`);
                const {Id, title, isActive} = row;
                addto.push({
                  Id,
                  title,
                  isActive,
                });
              }
              console.log(addto);
              resolve(addto);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  //
  getGoals() {
    console.log('this.getGoals() is executed ');
    return new Promise(resolve => {
      const goals = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT g.Id,g.goal,g.refTaskIcon,g.isCompleted,g.accomplishedPercentage,g.isActive FROM Goals g ',
              [],
            ).then(([tx, results]) => {
              console.log('Query completed');
              var len = results.rows.length;
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                console.log(
                  `at ID: ${row.Id}, at goals: ${row.goal},g refTaskIcon:${
                    row.refTaskIcon
                  }`,
                );
                const {
                  Id,
                  goal,
                  refTaskIcon,
                  isCompleted,
                  accomplishedPercentage,
                  isActive,
                } = row;
                goals.push({
                  Id,
                  goal,
                  accomplishedPercentage,
                  isCompleted,
                  refTaskIcon,
                  isActive,
                });
              }
              console.log(goals);
              resolve(goals);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  getGoalsByRefTaskIcon(refId) {
    console.log('this.getTaskRepeat() is executed ');
    return new Promise(resolve => {
      const goal = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql('SELECT * FROM Goals g WHERE g.refTaskIcon = ?', [
              refId,
            ]).then(([tx, results]) => {
              if (results.rows.length > 0) {
                let row = results.rows.item(0);
                resolve(results.rows.length);
              }
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  getGoalsById(id) {
    console.log('this.getTaskRepeat() is executed ');
    return new Promise(resolve => {
      const goal = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql('SELECT * FROM Goals WHERE Id = ?', [id]).then(
              ([tx, results]) => {
                if (results.rows.length > 0) {
                  let row = results.rows.item(0);
                  resolve(row);
                }
              },
            );
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  getTask() {
    console.log('this.getTask() is executed ');
    return new Promise(resolve => {
      const tasks = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT t.Id,t.task,t.taskDescription, t.refGoal,t.refAddTo,t.startDate,t.refTaskRepeat,t.refTaskRepeatEnd,t.endOnDate,t.refProgress,t.refPriority,t.orderIndex,t.isActive FROM Task t',
              [],
            ).then(([tx, results]) => {
              console.log('getTask Query completed');
              var len = results.rows.length;
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                //console.log(`tt ID: ${row.Id}, at goals: ${row.goals},g refTaskIcon:${row.refTaskIcon}`)
                const {
                  Id,
                  task,
                  taskDescription,
                  refGoal,
                  refAddTo,
                  startDate,
                  refTaskRepeat,
                  refProgress,
                  refPriority,
                  refTaskRepeatEnd,
                  orderIndex,
                  endOnDate,
                  isActive,
                } = row;
                tasks.push({
                  Id,
                  task,
                  taskDescription,
                  refGoal,
                  refAddTo,
                  startDate,
                  refTaskRepeat,
                  refTaskRepeatEnd,
                  refProgress,
                  refPriority,
                  endOnDate,
                  orderIndex,
                  isActive,
                });
              }
              console.log(tasks);
              resolve(tasks);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  // getTaskById(id) {
  //   console.log('this.getTaskById() is executed ');
  //   return new Promise(resolve => {
  //     const tasks = [];
  //     this.initDB()
  //         .then(db => {
  //           db.transaction(tx => {
  //             tx.executeSql(
  //                 'SELECT * FROM Task WHERE  Id == ?',
  //                 [id],
  //             ).then(([tx, results]) => {
  //               console.log('Query completed');
  //               var len = results.rows.length;
  //               // for (let i = 0; i < len; i++) {
  //                 let row = results.rows.item(0);
  //                 //console.log(`tt ID: ${row.Id}, at goals: ${row.goals},g refTaskIcon:${row.refTaskIcon}`)
  //                 const {
  //                   Id,
  //                   task,
  //                   taskDescription,
  //                   refGoal,
  //                   refAddTo,
  //                   startDate,
  //                   refTaskRepeat,
  //                   refProgress,
  //                   refPriority,
  //                   refTaskRepeatEnd,
  //                   orderIndex,
  //                   endOnDate,
  //                   isActive,
  //                 } = row;
  //                 tasks.push({
  //                   Id,
  //                   task,
  //                   taskDescription,
  //                   refGoal,
  //                   refAddTo,
  //                   startDate,
  //                   refTaskRepeat,
  //                   refTaskRepeatEnd,
  //                   refProgress,
  //                   refPriority,
  //                   endOnDate,
  //                   orderIndex,
  //                   isActive,
  //                 });
  //               // }
  //               console.log(tasks);
  //               resolve(tasks);
  //             });
  //           })
  //               .then(result => {
  //                 this.closeDatabase(db);
  //               })
  //               .catch(err => {
  //                 console.log(err);
  //               });
  //         })
  //         .catch(err => {
  //           console.log(err);
  //         });
  //   });
  // }

  // tx.executeSql('CREATE TABLE IF NOT EXISTS TaskOnDate (Id INTEGER PRIMARY KEY AUTOINCREMENT,refTask INTEGER,date TEXT,completedDate TEXT,isCompleted INTEGER,isActive INTEGER)');
  getTaskOnDate() {
    console.log('this.getTask() is executed');
    return new Promise(resolve => {
      const taskOnDate = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            // tx.executeSql('SELECT t.Id,t.refTask,t.date,t.completedDate,t.isCompleted,t.isActive FROM TaskOnDate t WHERE t.isActive = ?', [1]).then(([tx,results]) => {
            tx.executeSql('SELECT * FROM TaskOnDate t', []).then(
              ([tx, results]) => {
                console.log('Query completed');
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  //console.log(`tt ID: ${row.Id}, at goals: ${row.goals},g refTaskIcon:${row.refTaskIcon}`)
                  const {
                    Id,
                    refTask,
                    date,
                    completedDate,
                    isCompleted,
                    notifyId,
                    isNotificationRegistered,
                    isNotificationCancel,
                    isActive,
                  } = row;
                  taskOnDate.push({
                    Id,
                    refTask,
                    date,
                    completedDate,
                    isCompleted,
                    notifyId,
                    isNotificationRegistered,
                    isNotificationCancel,
                    isActive,
                  });
                }
                console.log(taskOnDate);
                resolve(taskOnDate);
              },
            );
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  getScheduledTaskOnDate() {
    console.log('this.getScheduledTaskOnDate() is executed');
    return new Promise(resolve => {
      const scheduledTaskOnDate = [];
      this.initDB()
          .then(db => {
            db.transaction(tx => {
              // tx.executeSql('SELECT t.Id,t.refTask,t.date,t.completedDate,t.isCompleted,t.isActive FROM TaskOnDate t WHERE t.isActive = ?', [1]).then(([tx,results]) => {
              tx.executeSql('SELECT * FROM TaskOnDate WHERE isNotificationRegistered = ? AND isNotificationCancel = ?', [1,0]).then(
                  ([tx, results]) => {
                    console.log('Query completed');
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                      let row = results.rows.item(i);
                      //console.log(`tt ID: ${row.Id}, at goals: ${row.goals},g refTaskIcon:${row.refTaskIcon}`)
                      const {
                        Id,
                        refTask,
                        date,
                        completedDate,
                        isCompleted,
                        notifyId,
                        isNotificationRegistered,
                        isNotificationCancel,
                        isActive,
                      } = row;
                      scheduledTaskOnDate.push({
                        Id,
                        refTask,
                        date,
                        completedDate,
                        isCompleted,
                        notifyId,
                        isNotificationRegistered,
                        isNotificationCancel,
                        isActive,
                      });
                    }
                    console.log("scheduledTaskOnDate :",scheduledTaskOnDate);
                    resolve(scheduledTaskOnDate);
                  },
              );
            })
                .then(result => {
                  this.closeDatabase(db);
                })
                .catch(err => {
                  console.log(err);
                });
          })
          .catch(err => {
            console.log(err);
          });
    });
  }
  getTaskOnDateByRefTask(refT) {
    console.log('this.getTaskOnDateByRefTask() is executed',refT);
    return new Promise(resolve => {
      const taskOnDate = [];
      this.initDB()
          .then(db => {
            db.transaction(tx => {
              // tx.executeSql('SELECT t.Id,t.refTask,t.date,t.completedDate,t.isCompleted,t.isActive FROM TaskOnDate t WHERE t.isActive = ?', [1]).then(([tx,results]) => {
              tx.executeSql('SELECT * FROM TaskOnDate Where refTask = ? ', [refT]).then(
                  ([tx, results]) => {
                    console.log('Query completed');
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                      let row = results.rows.item(i);
                      //console.log(`tt ID: ${row.Id}, at goals: ${row.goals},g refTaskIcon:${row.refTaskIcon}`)
                      const {
                        Id,
                        refTask,
                        date,
                        completedDate,
                        isCompleted,
                        notifyId,
                        isNotificationRegistered,
                        isNotificationCancel,
                        isActive,
                      } = row;
                      taskOnDate.push({
                        Id,
                        refTask,
                        date,
                        completedDate,
                        isCompleted,
                        notifyId,
                        isNotificationRegistered,
                        isNotificationCancel,
                        isActive,
                      });
                    }
                    console.log(taskOnDate);
                    resolve(taskOnDate);
                  },
              );
            })
                .then(result => {
                  this.closeDatabase(db);
                })
                .catch(err => {
                  console.log(err);
                });
          })
          .catch(err => {
            console.log(err);
          });
    });
  }
  getTaskByIconId(id) {
    console.log('this.getTaskByIconId() is executed ');
    return new Promise(resolve => {
      const goal = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql('SELECT * FROM TaskIcon t WHERE t.Id = ?', [id]).then(
              ([tx, results]) => {
                if (results.rows.length > 0) {
                  let row = results.rows.item(0);
                  resolve(row);
                }
              },
            );
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  getTaskIcon() {
    console.log('this.getTaskIcon() is executed ');
    return new Promise(resolve => {
      const taskIcon = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            console.log('initDB from getTaskIcon execute successfully');
            tx.executeSql(
              'SELECT t.Id,t.icon,t.customImage,t.isActive FROM TaskIcon t',
              [],
            ).then(([tx, results]) => {
              console.log('Query completed');
              var len = results.rows.length;
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                console.log(`tt ID: ${row.Id}, at icon: ${row.icon}`);
                const {Id, icon, customImage, isActive} = row;
                taskIcon.push({
                  Id,
                  icon,
                  customImage,
                  isActive,
                });
              }
              console.log(taskIcon);
              resolve(taskIcon);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  closeDatabase(db) {
    if (db) {
      console.log('Closing DB');
      db.close()
        .then(status => {
          console.log('Database CLOSED');
        })
        .catch(error => {
          this.errorCB(error);
        });
    } else {
      console.log('Database was not OPENED');
    }
  }
}
