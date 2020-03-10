export default function (num) {
  const n = Number(num);
  return `$${n.toFixed(0).replace(/./g, (c, i, a) => {
    //toFixed() 方法會使用定點小數表示法來格式化數字，裡面的參數代表四捨五入取到小數點後第幾位。
    //c:num中每個分別的數字，i:每個分別數字的id，a:num
    const currency = (i && c !== '.' && ((a.length - i) % 3 === 0) ? `, ${c}`.replace(/\s/g, '') : c);
    return currency;
  })}`;
}