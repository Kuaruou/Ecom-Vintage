export default function (num) {
  const n = Number(num);
  return `$${n.toFixed(0).replace(/./g, (c, i, a) => {
    //模板字符串(template literal)前面加上錢字號$
    //toFixed() 方法會使用定點小數表示法來格式化數字，裡面的參數代表四捨五入取到小數點後第幾位。
    //replace第一個參數為正則表達式或者字符串，第二個參數為要替換的字符或者回調函數。(/./g .代表取代換行字元以外的其他單一字元
    //第二個指定函式為參數的第一個參數match(參數c)，代表相對應的子字串，即為num中每個分別的數字，
    //第二個參數offset偏移，代表所檢驗的子字串在整個字串中的偏移量(參數i)，
    //第三個參數string，代表所檢驗的整個字串(參數a)
    const currency = (i && c !== '.' && ((a.length - i) % 3 === 0) ? `, ${c}`.replace(/\s/g, '') : c);
    //replace(/\s/g, '')中的\s代表一個空格，\s+代表一個或多個空格，以後方的空字串參數表示將空格拿掉，g全稱是global（全部），作用是打開全局匹配。
    //&&優先性6，!==優先性10，… ? … : …優先性4。若c不等於.且a的長度扣除i能被3整除則以,c取代之，若否則以c取代之。(千分號)
    return currency;
  })}`;
}