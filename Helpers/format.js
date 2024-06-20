function formatDate(value){
    const hours = String(value.getHours()).padStart(2, '0');
    const minutes = String(value.getMinutes()).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0')
    const month = getBulan(value.getMonth())
    const year = value.getFullYear();
    // let date = value.slice(3,15)
    return `${hours}:${minutes} ${day} ${month}`;
}


function getBulan(bulan) {
    const namaBulan = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
  
    return namaBulan[bulan];
  }




// console.log(commmaIntoArray("ha, hhh,    hahk"))

module.exports = formatDate
