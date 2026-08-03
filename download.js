// Lấy tất cả các nút mua hàng trên trang
const buyButtons = document.querySelectorAll(".buy-btn");

buyButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    // Tự động đọc dữ liệu từ chính cái nút mà khách vừa bấm
    const name = e.target.getAttribute("data-name");
    const fileUrl = e.target.getAttribute("data-file");
    const price = e.target.getAttribute("data-price");

    // Đóng gói vào một cục object sản phẩm
    const productInfo = {
      name: name,
      fileUrl: fileUrl,
      price: price,
    };

    // Tự động lưu vào localStorage
    localStorage.setItem("CineForge_Product", JSON.stringify(productInfo));

    // Chuyển hướng sang trang giỏ hàng hoặc thanh toán
    window.location.href = "gio_hang.html"; // hoặc thanh_toan.html tùy ý Phúc
  });
});

// Dùng thuộc tính download đúng với tên gốc của sản phẩm hoặc lấy trực tiếp từ fileUrl
const fileName = product.fileUrl
  ? product.fileUrl.split("/").pop()
  : product.name + ".mp4";
downloadBtn.href = product.fileUrl;
downloadBtn.download = fileName;
