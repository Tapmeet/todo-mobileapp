import NotifService from './NotifService';
import SQLdatabase from './SQLdatabase';

const db = new SQLdatabase();
const setNotification = (notif) => {
    console.log("setNotification is executed");
    let taskOnDateRegistered =[],taskOnDateCancel =[];
    let today = new Date();
    console.log("today:",today);
    let nd = today;
    let todayDate = today.getFullYear() +
        '-' +
        ('0' + (today.getMonth()+1)).slice(-2) +
        '-' +
        ('0' + today.getDate()).slice(-2);

    nd.setDate(nd.getDate() + 14);
    let nextNotificationDateLimit = nd.getFullYear() +
        '-' +
        ('0' + (nd.getMonth()+1)).slice(-2) +
        '-' +
        ('0' + nd.getDate()).slice(-2);

    console.log("todayDate:"+todayDate+" , NextMonthDate :",nextNotificationDateLimit);
    db.getTaskOnDate().then(result =>{
        db.getTask().then(taskResult =>{
        console.log("taskResult :",taskResult);
        console.log("result:",result);
        console.log("result length:",result.length);
        for(let i=0;i<result.length;i++){
            let tod = [];
            let toddate = result[i].date.split(" ");
            console.log("result[i]:",result[i]);
            console.log("todDate[0] :"+toddate[0]+"nextNotificationDateLimit :"+nextNotificationDateLimit+"todayDate :"+ todayDate+"result[i].isNotificationRegistered : "+ result[i].isNotificationRegistered + "result[i].isActive : "+ result[i].isActive)
            if(toddate[0] < nextNotificationDateLimit && toddate[0] > todayDate  && result[i].isNotificationRegistered == 0 && result[i].isActive==1 && result[i].isNotificationCancel == 0)
            {
                taskOnDateRegistered.push({
                    Id: result[i].Id,
                    refTask: result[i].refTask,
                    date: result[i].date,
                    completedDate: result[i].completedDate,
                    isCompleted: result[i].isCompleted,
                    notifyId: result[i].notifyId,
                    isNotificationRegistered: 1,
                    isNotificationCancel: result[i].isNotificationCancel,
                    isActive: result[i].isActive,
                    task : taskResult.find(t => t.Id == result[i].refTask).task
                });
                console.log("taskOnDateRegistered[i] :",taskOnDateRegistered);
            }
            else if(result[i].date < todayDate ){
                tod = result[i];
                tod.isNotificationCancel = 1;
                taskOnDateCancel.push(tod);
            }
        }
        if(taskOnDateRegistered.length > 0) {
            console.log("taskOnDateRegistered :", taskOnDateRegistered);
            db.updateTaskOnDateList(taskOnDateRegistered).then(response => {
                // this.notif.checkPermission(this.handlePerm.bind(this));
                // this.notif.configure(
                //     this.onRegister.bind(this),
                //     this.onNotif.bind(this),
                // );
                for (let i = 0; i < taskOnDateRegistered.length; i++) {
                    let dT = taskOnDateRegistered[i].date.split(" ");
                    let d = dT[0].split("-");
                    let t = dT[1].split(":");
                    let date = new Date(d[0], d[1] - 1, d[2], t[0], t[1], 0, 0);
                    console.log("notification Time :", date);
                    notif.scheduleNotif(
                        taskOnDateRegistered[i].notifyId,
                        "Conscientiousness Coach",
                        taskOnDateRegistered[i].task + " is scheduled for now",
                        date,
                        '',
                    );
                }
            });

        }
        if(taskOnDateCancel.length > 0)
        {
            console.log("taskOnDateCancel :",taskOnDateCancel);
            db.updateTaskOnDateList(taskOnDateCancel).then(response =>{
                // this.notif.checkPermission(this.handlePerm.bind(this));
                // this.notif.configure(
                //     this.onRegister.bind(this),
                //     this.onNotif.bind(this),
                // );
                for(let i= 0;i< taskOnDateCancel.length;i++) {
                    notif.cancelNotif(taskOnDateCancel[i].notifyId);
                }
            })
        }
    });
    });
}
const CancelScheduledNotification = (notif)=> {
    let scheduledNotifications =[],taskOnDateRegistered = [];
    db.getScheduledTaskOnDate().then(result =>{
        scheduledNotifications = result;
        scheduledNotifications.forEach(s =>{
           notif.cancelNotif(s.notifyId);
           s.isNotificationRegistered = 0;
           taskOnDateRegistered.push(s);
        })
        db.updateTaskOnDateList(taskOnDateRegistered).then(response =>{
            console.log("Scheduled Notification are canceled successfully");
        })
    })
}
const setNotificationOfInCompleteTask = (task,taskName,notif)=>{
    console.log("setNotificationOfInCompleteTask method is executed",task);
    let td = new Date();
    let ndt = new Date();
    ndt.setDate(ndt.getDate() + 14);
    let nextNotificationDateLimit = ndt.getFullYear() +
        '-' +
        ('0' + (ndt.getMonth()+1)).slice(-2) +
        '-' +
        ('0' + ndt.getDate()).slice(-2) +
        ' ' +
        ndt.toLocaleTimeString();
    let todayDate = td.getFullYear() +
        '-' +
        ('0' + (td.getMonth()+1)).slice(-2) +
        '-' +
        ('0' + td.getDate()).slice(-2) +
        ' ' +
        td.toLocaleTimeString();
    let dateTime = task.date.split(" ");
    let d = dateTime[0].split("-");
    let t = dateTime[1].split(":");
    let date = new Date(d[0], d[1] - 1, d[2], t[0], t[1], 0, 0);
    let taskDate = date.getFullYear() +
        '-' +
        ('0' + (date.getMonth()+1)).slice(-2) +
        '-' +
        ('0' + date.getDate()).slice(-2) +
        ' ' +
        date.toLocaleTimeString();
    console.log("nextDateLimit :"+nextNotificationDateLimit +"todayDate :"+todayDate + "Task Date :"+date);
    if(taskDate > todayDate && taskDate < nextNotificationDateLimit){
        if(task.isNotificationRegistered == 1){
             notif.scheduleNotif(
                 task.notifyId,
                "Conscientiousness Coach",
                taskName + " is scheduled for now",
                 date,
                '',
            );
        }
        else{
            let notifyId = new Date().toISOString();
            notif.scheduleNotif(
                task.notifyId + + task.date,
                "Conscientiousness Coach",
                task.task + " is scheduled for now",
                date,
                '',
            );
        }
        task.isNotificationRegistered = 1;
        task.isNotificationCancel = 0;
        db.updateTaskOnDate(task.Id,task).then(response =>{
            console.log("Task update successfully :",response);
        })
    }
}
const CancelNotificationOfCompleteTask =(task,notif)=>{
    task.isCompleted = 1;
    task.isNotificationCancel = 1;

    db.updateTaskOnDate(task.Id, task).then(res => {
        if(task.isNotificationRegistered == 1)
        notif.cancelNotif(task.notifyId);
        console.log("taskOnDate is updated :", res);
    })
}
export {setNotification,CancelScheduledNotification,setNotificationOfInCompleteTask,CancelNotificationOfCompleteTask};
