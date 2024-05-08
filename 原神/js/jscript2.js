/* let a = prompt("年份")
alert(2023 - parseInt(a)) */
/* let price = 105, sl = 0.05
let fk = price * (1 + sl)
alert("付款额=" + fk)
let bj = fk / (1 + sl)
alert("标价=" + bj) */
// let a = parseFloat(prompt("请输入数字"))
// console.log(typeof a)
/* if(a%4==0 && a%100!=0 || a%400==0){
document.write("当前年份是闰年")
}
else{
document.write("当前年份不是闰年")
} */
/* if (a < 10) {
    a = "0" + a
}
alert(a) */
/* if (a % 2 == 0) {
    alert("偶数")
}
else {
    alert("奇数")
} */
/* switch (a) {
    case 1:
        document.write("星期一");
        break;
    case 2:
        document.write("星期二");
        break;
    case 3:
        document.write("星期三");
        break;
    case 4:
        document.write("星期四");
        break;
    case 5:
        document.write("星期五");
        break;
    case 6:
        document.write("星期六");
        break;
    case 7:
        document.write("星期七");
        break;
}
let b = parseFloat(prompt("输入一个数"))
let c = parseFloat(prompt("输入一个数"))
if (b > c) {
    document.write(b)
    document.write("<br>")
    document.write(c)
}
else if (c >= b) {
    document.write(c)
    document.write("<br>")
    document.write(b)
} */
/* for (let i = 100; i < 1000; i++) {
    let bw = parseInt(i / 100)
    let sw = parseInt((i - bw * 100) / 10)
    let gw = parseInt(i % 10)
    if (bw * bw * bw + sw * sw * sw + gw * gw * gw == i) {
        alert(i)
    }
} */
/* Arr[0]="星期一"
arr[1]="星期二"
arr[2]="星期三"
arr[3]="星期四"
arr[4]="星期五"
arr[5]="星期六"
arr[6]="星期七" */
/* for(let i =0,sum=0,max=0;i<arr.length;i++)
{
    sum+=arr[i]
    if(max<arr[i]){
        max=arr[i]
        console.log(max)
    }
} */
/* let arr = [1,2,3,4,5,6,7,8,9,10,15,20,25,30,35,40]
let newarr= []
for(let i = 0,j=0;i<=arr.length;i++){
    if(arr[i]>10){
        newarr[j]=arr[i]
        j++
    }
}
console.log(newarr) */
/* let a = prompt("请输入数字")
console.log(typeof a)
if (a % 4 == 0 && a % 100 != 0 || a % 400 == 0) {
    document.write("当前年份是闰年")
}
else {
    document.write("当前年份不是闰年")
} */

var cs=parseInt(prompt("层数"))
for(let i=0;i<=cs;i++){
    for(let j=1;j<=i;j++){
        document.write("&nbsp;")
    }

    for(let k=cs;k>i;k--){
        document.write("*&nbsp;")
    }
    document.write("<br>")
}