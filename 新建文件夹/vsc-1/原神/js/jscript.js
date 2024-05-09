/* let a = [1,2,3,2,2,1,3,4,2,5]
for(let i = 0;i<a.length;i++){
    // console.log(a[i])
    for(let j = i + 1; j <a.length; j++){
            console.log(a[j]);
        if(a[i] == a[j]){
            a.splice[j,1];
            j--
        }
    }
}
console.log(a) */

/* var arr = [1, 2, 3]
var arr = [[10, 11], [2, 2]]

console.log(arr[0])
console.log(arr[0][1]) */
/* let stydents = [
    ['李丽', 78, 92],
    ['李佳', 64, 78],
    ['马博', 88, 62],
    ['赵耿', 72, 85],
    ['李明', 90, 87],
    ['蔡佳', 95, 90],
]
document.write("<table>")
for (let i = 0; i < stydents.length; i++) {
    document.write("<tr>")
    for (let j = 0; j < stydents[i].length; j++) {
        document.write("<td>" + stydents[i][j] + "</td>")
    }
    document.write("</tr>")
} */
/* function a(ks,js){
    sum=0
    for(let i =ks;i<js;i++){
        sum+=i
    }
    console.log(sum)
}
a(1,10)
 */
/* function y(bj){
    mj=bj*(bj)*3.14
    console.log(mj)
}
y(1)
 */
/* function max(sz){
    var zd=0
    for (let i = 0,a=0; i < sz.length;i++){
        if (sz[i]>a){
            zd=sz[i]
        }
        else {a=i}
    }
    console.log(zd)
}
let arr=[9,8,7,5,6,4,1,3,2,10]
max(arr) */
/* function ar(a){
    let sz=[]
    for(let i=0;i<100;i++){
        sz[i]=arguments[i]=i
    }
    return sz
}
console.log(ar()); */

/* function getyear(year){
    var mark=false
    if(year%4==0&&year%100!=0||year%400==0){
        mark=true
    }
    return mark
}

function geiday(){
    var year=prompt("请输入年份")
    if(getyear(year)){
        document.write("闰年")
    }
    else{
        document.write("平年")
    }
}
geiday() */
/* var stydents = {
    uname:"",
    age: "age",
    sex: "sex",
    
    D: function ad(name,age,sex){
        this.uname=name
        this.age=age
        this.sex=sex
    }
}
stydents.D(prompt("您的名字"),prompt("年龄"),prompt("性别"))
console.log(stydents);

for (var key in stydents) {
    console.log(key)
    console.log(stydents[key])
} */

/* var time = new Date
var weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
var xq = weekDays[time.getDay()];

var hou=time.getHours()
hou= hou<10? "0"+hou:hou 
var min=time.getMinutes()
min= min<10? "0"+min:min 
var miao=time.getSeconds()
miao= miao<10? "0"+miao:miao 

document.write(time.getFullYear() + "年" + " " +parseInt(time.getMonth() + 1) + "月" + " " + time.getDate() + "日" + " " + xq+" "+hou+"时"+" "+min+"分"+" "+miao+"秒")
 */
/* var strt = Date.now()

for(let i=0;i<=100;i++){
    console.log(i);
}

var end = Date.now()
console.log("花费的时间为:"+(end-strt)+"ms"); */
/* setInterval(function () {
    function gettimer() {
        var sj = new Date
        var s = sj.getHours()
        var f = sj.getMinutes()
        var m = sj.getSeconds()
        s = s < 10 ? "0" + s : s
        f = f < 10 ? "0" + f : f
        m = m < 10 ? "0" + m : m

        var time = s + ":" + f + ":" + m
        console.log(time);
        document.time.time1.value = s + ":" + f + ":" + m
    }
    gettimer()
},1000)

 */
var date = new Date
function yhsj(time){
    var nowtime = +new Date
    var usertime = +new Date(time)
    var sysj=(nowtime-usertime)/1000
    var d=Math.floor((sysj / 60 / 60 / 24))
    var h=Math.floor((sysj / 60 / 60 % 24))
    var m=Math.floor((sysj / 60 % 24))
    var s=Math.floor((sysj % 24))
    console.log(d+"天"+h+"时"+m+"分"+s+"秒");
}
yhsj('2023-6-10 12:00:00')

function r(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
