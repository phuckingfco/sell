// Cập nhật hàm chọn phương thức thanh toán để bật form nhập STK
// function selectPayment(method) {
//   const directBankBox = document.getElementById("directBankBox");
//   const directBankForm = document.getElementById("directBankForm");
//   const directBankTitle = document.getElementById("directBankTitle");

//   if (method === "directBank") {
//     directBankBox.style.borderColor = "#3b82f6";
//     directBankTitle.style.color = "#fff";
//     directBankForm.style.display = "block"; // Hiện khung nhập STK
//   }
// }

// Hàm xử lý khi khách bấm hoàn tất thanh toán bằng STK cá nhân
// function handleDirectBankPayment() {
//   const email = document.getElementById("customerEmail").value.trim();
//   const bankName = document.getElementById("buyerBankName").value;
//   const accountNumber = document
//     .getElementById("buyerAccountNumber")
//     .value.trim();
//   const accountName = document.getElementById("buyerAccountName").value.trim();

//   if (!email) {
//     alert("Vui lòng nhập email liên hệ!");
//     return;
//   }

//   if (!accountNumber || !accountName) {
//     alert("Vui lòng nhập đầy đủ Số tài khoản và Tên chủ tài khoản của bạn!");
//     return;
//   }

//   // Lấy tổng tiền giỏ hàng
//   const cart = getCart();
//   let totalAmount = 0;
//   cart.forEach((item) => {
//     totalAmount += item.price * (item.quantity || 1);
//   });

// Thông báo xác nhận đang thực hiện lệnh chuyển tiền từ STK của khách về STK của Phúc
//   alert(
//     `Đang kết nối cổng thanh toán ${bankName}...\nLệnh chuyển ${totalAmount.toLocaleString()}đ từ STK: ${accountNumber} (${accountName}) về tài khoản CineForge đã được ghi nhận!`,
//   );

// Xóa giỏ hàng và chuyển hướng
//   if (typeof saveCart === "function") {
//     saveCart([]);
//   }
//   window.location.href = "san_pham.html";
// }

function xuLyThanhToanGiaLap() {
  const email = document.getElementById("customerEmail").value.trim();
  if (!email) {
    alert("Vui lòng nhập email để nhận link tải file!");
    return;
  }

  // 1. Tạo hiệu ứng đang chờ hệ thống kiểm tra tiền
  const loadingHTML = `
    <div id="loadingOverlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 9999; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #fff; font-family: 'Inter', sans-serif;">
      <div style="border: 4px solid #1f2937; border-top: 4px solid #38bdf8; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin-bottom: 1rem;"></div>
      <h3 style="color: #38bdf8; margin-bottom: 0.5rem;">Đang kết nối cổng ngân hàng...</h3>
      <p style="color: #94a3b8; font-size: 0.9rem;">Hệ thống đang đối soát mã giao dịch tự động, vui lòng không tắt trình duyệt.</p>
    </div>
    <style>
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
  `;
  document.body.insertAdjacentHTML("beforeend", loadingHTML);

  // 2. Giả lập sau 3 giây hệ thống tự động "báo tin nhắn tiền vào" thành công
  setTimeout(() => {
    // Lưu trạng thái vào localStorage để trang download nhận biết khách đã trả tiền
    localStorage.setItem("CineForge_Paid", "true");
    localStorage.setItem("CineForge_Email", email);

    // Xóa giỏ hàng
    if (typeof saveCart === "function") {
      saveCart([]);
    }

    // Chuyển hướng sang trang download tài liệu/phần mềm
    window.location.href = "download.html";
  }, 3500); // 3.5 giây
}

const memoText = "CINEFORGE " + Math.floor(100000 + Math.random() * 900000);
