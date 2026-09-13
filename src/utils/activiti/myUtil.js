export function format(time, format) {
  var t = new Date(time);
  var tf = function (i) { return (i < 10 ? '0' : '') + i };
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear());
        break;
      case 'MM':
        return tf(t.getMonth() + 1);
        break;
      case 'mm':
        return tf(t.getMinutes());
        break;
      case 'dd':
        return tf(t.getDate());
        break;
      case 'HH':
        return tf(t.getHours());
        break;
      case 'ss':
        return tf(t.getSeconds());
        break;
    }
  })
}

/**
 * 计算出相差天数
 * @param secondSub
 */
export function formatTotalDateSub (secondSub) {
  var days = Math.floor(secondSub / (24 * 3600));     // 计算出小时数
  var leave1 = secondSub % (24*3600) ;                // 计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / 3600);              // 计算相差分钟数
  var leave2 = leave1 % (3600);                       // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / 60);              // 计算相差秒数
  var leave3 = leave2 % 60;                           // 计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3);
  return days + "天" + hours + "时" + minutes + "分" + seconds + '秒';
}

/**
 * 计算四舍五入保留小数后2位
 * @param num 计算值
 * @param percentage 百分比，小数形式（0.1）
 * @param digits 保留几位小数
 */
export function reserveNumber(num, percentage, digits) {
  return Number((num * percentage).toFixed(digits))
}

/**
 * 字符串转数字，非数字为0
 */
export function initNumber(num) {
  if(!isNaN(Number(num)))
    return Number(num)
  return 0
}

/**
 * 根据 -+ 拆分字符串
 * @param str
 * @returns {*}
 */
export function splitStringByMinusOrPlus(str) {
  // 使用正则表达式作为分隔符，匹配 '-' 或 '+'
  const regex = /[-+]/;
  return str.split(regex);
}

/**
 * 电话号码取前3后4位
 * @param phoneNumber
 * @returns {string}
 */
export function phoneNumberParts(phoneNumber) {
  // 检查电话号码的长度是否至少为7
  if (phoneNumber.length < 7) {
  }
  // 提取前3位
  let firstPart = phoneNumber.slice(0, 3);
  // 提取后4位
  let lastPart = phoneNumber.slice(-4);
  // 返回结果
  return firstPart+ '****' +lastPart;
}

/**
 * 姓名匿名
 * @param name
 * @returns {string}
 */
export function nickNameParts(name) {
  return name.slice(0, 1) + '*';
}

/**
 * 初始化查询房产物业类型
 * 0住宅 / 1公寓 / 2别墅 / 3写字楼 / 4商铺 / 5厂房 / 6车位 / 7平房 / 8土地 / 9旅馆/酒店 / 10仓库
 * @param num
 */
export function initHouseType(num) {
  if(num === '0') return '住宅'
  else if(num === '1') return '公寓'
  else if(num === '2') return '别墅'
  else if(num === '3') return '写字楼'
  else if(num === '4') return '商铺'
  else if(num === '5') return '厂房'
  else if(num === '6') return '车位'
  else if(num === '7') return '平房'
  else if(num === '8') return '土地'
  else if(num === '9') return '旅馆/酒店'
  else if(num === '10') return '仓库'
}

/**
 *
 * @param specifiedTime 日期
 * @param daysThreshold 
 * @returns {boolean}
 */
export function isTimeExceeded(specifiedTime, daysThreshold) {
  // 获取当前时间
  let currentTime = new Date();
  // 解析指定的时间（假设 specifiedTime 是一个字符串，格式为 "YYYY-MM-DDTHH:mm:ss"）
  // 如果 specifiedTime 是其他格式，你需要相应地调整 Date 对象的创建方式
  let specifiedDate = new Date(specifiedTime);
  // 检查指定的时间是否有效
  if (isNaN(specifiedDate.getTime())) {
    console.error('Invalid specified time format');
    return false; // 或者你可以抛出一个错误
  }
  // 计算两个时间之间的差值（以毫秒为单位）
  let timeDifference = currentTime - specifiedDate;
  // 将毫秒差值转换为天数
  let daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  // 检查是否超过指定的天数
  return daysDifference > daysThreshold;
}

//金额大小写转换
export function numberToChineseUppercase(number) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];
  let num = Math.abs(number);
  let s = '';
  const decimalPart = Math.floor((num * 100) % 100);
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(decimalPart / (10 ** (1 - index))) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(number);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  if(s === '整') return '零元整'
  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^元$/, '零元');
}

export function getGenderAndBirthFromID(idCard) {
  // 首先判断身份证号码是否为18位或15位
  if (!/^\d{15}(\d{2}[\dXx])?$/.test(idCard)) {
    return { error: 'Invalid ID card number' };
  }

  let gender, birthDate;

  // 转换身份证号码为字符串，方便处理
  // idCard = idCard.toUpperCase().replace(/X$/, '10'); // 将末尾的X替换为10

  if (idCard.length === 18) {
    // 提取出生年月日（YYYYMMDD）
    birthDate = idCard.slice(6, 14);
    // 提取性别（第17位奇数为男，偶数为女）
    gender = (parseInt(idCard.slice(16, 17)) % 2 === 0) ? '女' : '男';
  } else if (idCard.length === 15) {
    // 15位身份证号码的处理（转换为18位）
    let year = '19' + idCard.slice(6, 8);
    let month = idCard.slice(8, 10);
    let day = idCard.slice(10, 12);
    birthDate = `${year}${month}${day}`;

    // 提取性别（第15位奇数为男，偶数为女）
    gender = (parseInt(idCard.slice(14, 15)) % 2 === 0) ? '女' : '男';

    // 假设我们要返回18位的结果（仅示例，实际使用可能需要根据需求处理）
    // idCard = `${idCard.slice(0, 6)}${year}${month}${day}${idCard.slice(12)}${(parseInt(idCard.slice(14, 15)) % 11).toString().padStart(1, '0')}X`.slice(0, 17) + (parseInt(idCard.slice(14, 15)) % 11 === 10 ? 'X' : (parseInt(idCard.slice(14, 15)) % 11).toString());
  }

  let bro =  birthDate.slice(0, 4) + '年' + birthDate.slice(4, 6)+ '月'+ birthDate.slice(6, 8)+'日';
  // 返回结果
  return {
    gender: gender,
    birthDate: bro
  };
}
