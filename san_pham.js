// Hàm tự động cập nhật số lượng hiển thị trên nút Giỏ hàng của Menu
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("CineForge_Cart")) || [];

  // Ép kiểu parseInt cho quantity để tránh bị cộng dồn chuỗi
  let totalQuantity = cart.reduce(
    (sum, item) => sum + (parseInt(item.quantity) || 1),
    0,
  );

  const cartBtn = document.querySelector(".cart-btn");
  if (cartBtn) {
    cartBtn.textContent = `Giỏ hàng (${totalQuantity})`;
  }
}

// Chạy ngay khi vừa load xong trang sản phẩm
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});

// Hàm Mua Ngay: Lưu sản phẩm và chuyển thẳng sang trang thanh toán
function buyNowDirect(button) {
  const name = button.getAttribute("data-name");
  const fileUrl = button.getAttribute("data-file");
  const price = button.getAttribute("data-price");

  const productInfo = {
    name: name,
    fileUrl: fileUrl,
    price: parseInt(price),
  };

  localStorage.setItem("CineForge_Product", JSON.stringify(productInfo));
  window.location.href = "thanh_toan.html";
}

// Hàm Thêm Giỏ Hàng: Thêm sản phẩm, cập nhật số lượng và lưu trữ
function addToCartCustom(button) {
  const name = button.getAttribute("data-name");
  const fileUrl = button.getAttribute("data-file");
  const price = parseInt(button.getAttribute("data-price"));

  let cart = JSON.parse(localStorage.getItem("CineForge_Cart")) || [];

  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.quantity = (parseInt(existing.quantity) || 1) + 1;
  } else {
    cart.push({ name: name, fileUrl: fileUrl, price: price, quantity: 1 });
  }

  localStorage.setItem("CineForge_Cart", JSON.stringify(cart));
  localStorage.setItem(
    "CineForge_Product",
    JSON.stringify({ name, fileUrl, price }),
  );

  updateCartCount();
  alert("Đã thêm sản phẩm vào giỏ hàng thành công!");
}
