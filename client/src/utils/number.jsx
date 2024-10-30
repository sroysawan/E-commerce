import numeral from 'numeral'

//เติม , ให้ตัวเลข เช่น 10000 => 10,000
export const numberFormat = (num) =>{
    return numeral(num).format('0,0')
}