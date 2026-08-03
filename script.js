// --- QUẢN LÝ ĐĂNG NHẬP & GIAO DIỆN ---
document.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("loginModal");

  updateUserInterface();
  updateCartCount();

  if (loginModal) {
    const loginBtnTrigger =
      document.getElementById("login") ||
      document.getElementById("authBtn") ||
      document.querySelector(".login-btn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const loginForm = loginModal.querySelector("form");
    const googleLoginBtn = document.getElementById("googleLoginBtn");

    if (loginBtnTrigger) {
      loginBtnTrigger.addEventListener("click", (e) => {
        if (localStorage.getItem("isLoggedIn") !== "true") {
          e.preventDefault();
          loginModal.style.display = "flex";
        }
      });
    }

    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", () => {
        loginModal.style.display = "none";
      });
    }

    loginModal.addEventListener("click", (e) => {
      if (e.target === loginModal) {
        loginModal.style.display = "none";
      }
    });

    if (googleLoginBtn) {
      googleLoginBtn.addEventListener("click", () => {
        const googleUsername = "Phúc";
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", googleUsername);
        localStorage.setItem("userName", googleUsername);
        loginModal.style.display = "none";
        updateUserInterface();
        alert("Đăng nhập bằng Google thành công!");
      });
    }

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const textInput = loginForm.querySelector('input[type="text"]');
        const userInput = textInput ? textInput.value : "Phúc";

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", userInput);
        localStorage.setItem("userName", userInput);
        loginModal.style.display = "none";
        updateUserInterface();
        alert("Đăng nhập thành công!");
      });
    }
  }

  const cartBtn = document.querySelector(".cart-btn");
  if (cartBtn) {
    cartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "./gio_hang.html";
    });
  }
});

// Hàm cập nhật giao diện (Đăng nhập / Chào Phúc + Đăng xuất trực tiếp)
function updateUserInterface() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const username =
    localStorage.getItem("username") || localStorage.getItem("userName");

  // Tìm nút đăng nhập qua id="login" hoặc id="authBtn" hoặc class=".login-btn"
  const loginBtn =
    document.getElementById("login") ||
    document.getElementById("authBtn") ||
    document.querySelector(".login-btn");

  if (isLoggedIn === "true" && loginBtn) {
    const displayName =
      username && username.includes("@")
        ? username.split("@")[0]
        : username || "Phúc";

    loginBtn.textContent = `Chào, ${displayName} (Đăng xuất)`;
    loginBtn.href = "#"; // Chặn chuyển trang login.html

    loginBtn.style.background = "linear-gradient(135deg, #00f2fe, #4facfe)";
    loginBtn.style.color = "#0b0f19";
    loginBtn.style.fontWeight = "700";
    loginBtn.style.padding = "0.5rem 1rem";
    loginBtn.style.borderRadius = "0.5rem";
    loginBtn.style.textDecoration = "none";

    // Bấm vào chữ "Chào, Phúc (Đăng xuất)" sẽ tiến hành đăng xuất ngay lập tức
    loginBtn.onclick = (e) => {
      e.preventDefault(); // Chặn dấu # nhảy lên đầu trang
      if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        localStorage.removeItem("userName");

        alert("Đã đăng xuất thành công!");
        location.reload(); // Tải lại trang
      }
    };
  }
}

// --- QUẢN LÝ GIỎ HÀNG ---
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const cartBtns = document.querySelectorAll(
    ".cart-btn, a[href*='gio_hang.html']",
  );
  cartBtns.forEach((btn) => {
    btn.textContent = `Giỏ hàng (${totalItems})`;
  });
}
// Hàm thêm vào giỏ hàng tự động đọc dữ liệu từ nút bấm
// function addToCartFromButton(buttonElement) {
//   const productName = buttonElement.getAttribute("data-name");
//   const productPrice = parseInt(buttonElement.getAttribute("data-price"));

//   let cart = getCart();
//   const existingIndex = cart.findIndex((item) => item.name === productName);

//   if (existingIndex > -1) {
//     cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
//   } else {
//     cart.push({ name: productName, price: productPrice, quantity: 1 });
//   }

//   saveCart(cart);
//   alert(
//     `Đã thêm "${productName}" (${productPrice.toLocaleString()}đ) vào giỏ hàng thành công!`,
//   );
// }

function addToCartFromButton(buttonElement, customName) {
  // Nếu có truyền tên trực tiếp thì dùng, không thì mới đi tìm
  let productName = customName;
  if (!productName) {
    const card =
      buttonElement.closest(".product-card") || buttonElement.closest("div");
    const titleEl = card
      ? card.querySelector("h3") || card.querySelector("h4")
      : null;
    productName = titleEl ? titleEl.textContent.trim() : "Sản phẩm";
  }

  const productPrice = parseInt(buttonElement.getAttribute("data-price")) || 0;

  let cart = getCart();
  const existingIndex = cart.findIndex((item) => item.name === productName);

  if (existingIndex > -1) {
    cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
  } else {
    cart.push({ name: productName, price: productPrice, quantity: 1 });
  }

  saveCart(cart);
  showToast(`Đã thêm "${productName}" vào giỏ hàng!`);
}

// Hàm mở bảng QR thanh toán (Sử dụng ảnh cá nhân QR_fake.jpg)
function openQRModal() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Giỏ hàng của bạn đang trống!");
    return;
  }

  // Tính tổng tiền hiển thị (nếu có chỗ chứa tiền)
  let totalAmount = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0,
  );
  const amountEl = document.getElementById("qrAmountText");
  if (amountEl) {
    amountEl.textContent = totalAmount.toLocaleString() + "đ";
  }

  // Mở modal QR lên và giữ nguyên ảnh cá nhân của Phúc
  const modal = document.getElementById("qr-modal");
  if (modal) modal.style.display = "flex";
}

// Hàm đóng bảng QR thanh toán
function closeQRModal() {
  const modal = document.getElementById("qr-modal");
  if (modal) modal.style.display = "none";
}

// Hàm xác nhận khi người dùng đã thanh toán xong
function confirmPaymentSuccess() {
  alert("Thanh toán thành công! Cảm ơn bạn đã ủng hộ CineForge.");
  localStorage.removeItem("cart"); // Xóa giỏ hàng sau khi mua thành công
  window.location.href = "index.html"; // Quay về trang chủ
}

//
function showToast(message) {
  // Kiểm tra xem đã có khung thông báo chưa, chưa thì tạo mới
  let toast = document.getElementById("custom-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "custom-toast";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span style="color: #38bdf8; font-weight: bold;">CineForge:</span> ${message}`;
  toast.classList.add("show");

  // Sau 3 giây tự động ẩn đi
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
showToast('Đã thêm "' + name + '" vào giỏ hàng thành công!');

// Thêm full fabicon
// Tự động thêm favicon cho mọi trang web khi tải xong
document.addEventListener("DOMContentLoaded", () => {
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/svg+xml";
  link.href = "./fabicon.svg";
  document.head.appendChild(link);
});
