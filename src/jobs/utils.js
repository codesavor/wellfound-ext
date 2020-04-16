export function formatNumber(n) {
  var num = +n;
  if (num < 1000) {
    return "$" + num;
  } else if (num < 1000000) {
    return "$" + Math.floor(num / 1000) + "k";
  } else {
    return "$" + Math.floor(num / 1000000) + "m";
  }
}