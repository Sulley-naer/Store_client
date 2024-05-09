$("body > main > div.col-4.left > div.tab > div.head > span").on(
  "click",
  function () {
    $(this).toggleClass("act").siblings("span").removeClass("act");
  }
);
$("body > main > div.col-3.rig .head > span").on("click", function () {
  $(this).toggleClass("act").siblings("span").removeClass("act");
});

$("div.col-3.rig > div.main.item-border > div > div.msgbox > span").on(
  "click",
  function () {
    $(this).addClass("act").siblings("span").removeClass("act");
  }
);
$(
  "body > main > div.col-3.rig > div.foot.item-border > div.main > div.mid > div"
).on("click", function () {
  $(this).addClass("act").siblings("div").removeClass("act");
});

document.body.onload = () => {
  let tb = $("body > main > div.col-4.left > div.tab > div.content > table");
  let sj = tb.clone();
  tb.parent().append(sj);
};
