// --- QUẢN LÝ ĐĂNG NHẬP, GIỎ HÀNG & GIAO DIỆN ---
document.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("loginModal");

  updateUserInterface();
  updateCartCount();

  // 1. Xử lý Modal Đăng nhập
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

  // 2. Xử lý hiển thị tổng tiền ở trang thanh toán
  const totalDisplay =
    document.getElementById("checkoutTotal") ||
    document.getElementById("totalPriceDisplay");

  if (totalDisplay) {
    const directProduct = localStorage.getItem("CineForge_Product");
    let cart = [];

    if (directProduct) {
      try {
        cart = [JSON.parse(directProduct)];
      } catch (e) {
        cart = [];
      }
    } else {
      try {
        cart = JSON.parse(localStorage.getItem("CineForge_Cart")) || [];
      } catch (e) {
        cart = [];
      }
    }

    if (cart.length === 0) {
      cart = [{ name: "Sản phẩm CineForge", price: 0 }];
    }

    let total = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
    totalDisplay.textContent = total.toLocaleString("vi-VN") + "đ";
  }

  // 3. Xử lý hiển thị thông tin sản phẩm và nút download (Dành cho trang download.html)
  const downloadContainer = document.getElementById("downloadContent");
  const emailDisplay = document.getElementById("buyerEmailDisplay");

  if (downloadContainer || document.getElementById("productNameDisplay")) {
    const isPaid = localStorage.getItem("CineForge_Paid");

    if (window.location.pathname.includes("download.html")) {
      if (!isPaid || isPaid !== "true") {
        alert("Bạn chưa thanh toán đơn hàng nên chưa có quyền truy cập trang này!");
        window.location.href = "gio_hang.html";
        return;
      }
    }

    if (emailDisplay) {
      emailDisplay.textContent = localStorage.getItem("CineForge_Email") || "Khách hàng";
    }

    let product = null;
    try {
      product = JSON.parse(localStorage.getItem("CineForge_Product"));
    } catch (e) {
      product = null;
    }

    if (!product) {
      try {
        const cart = JSON.parse(localStorage.getItem("CineForge_Cart")) || [];
        if (cart.length > 0) {
          product = cart[cart.length - 1];
        }
      } catch (e) {
        product = null;
      }
    }

    if (product && downloadContainer) {
      const fileName = product.name || "video_download.mp4";
      downloadContainer.innerHTML = `
        <div style="background: #0b0f19; border: 1px solid #3b82f6; padding: 1rem; border-radius: 0.75rem; margin-bottom: 1rem; text-align: left;">
          <p style="margin: 0; color: #94a3b8; font-size: 0.85rem;">Sản phẩm của bạn:</p>
          <p style="margin: 0.3rem 0 0 0; color: #fff; font-weight: 600; font-size: 0.95rem;">🎥 ${fileName}</p>
        </div>
        <a
          href="${product.fileUrl || '#'}"
          download="${fileName}"
          style="
            display: block;
            width: 100%;
            background: #38bdf8;
            color: #0b0f19;
            text-align: center;
            text-decoration: none;
            border: none;
            padding: 1rem;
            border-radius: 0.75rem;
            font-weight: bold;
            font-size: 1rem;
            box-sizing: border-box;
            cursor: pointer;
          "
        >
          📥 Tải xuống video ngay
        </a>
      `;
    } else if (downloadContainer) {
      downloadContainer.innerHTML = `
        <p style="color: #ef4444; font-size: 0.9rem;">Không tìm thấy thông tin sản phẩm!</p>
      `;
    }
  }
});

// --- HÀM CẬP NHẬT GIAO DIỆN ĐĂNG NHẬP ---
function updateUserInterface() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const username =
    localStorage.getItem("username") || localStorage.getItem("userName");

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
    loginBtn.href = "#";

    loginBtn.style.background = "linear-gradient(135deg, #00f2fe, #4facfe)";
    loginBtn.style.color = "#0b0f19";
    loginBtn.style.fontWeight = "700";
    loginBtn.style.padding = "0.5rem 1rem";
    loginBtn.style.borderRadius = "0.5rem";
    loginBtn.style.textDecoration = "none";

    loginBtn.onclick = (e) => {
      e.preventDefault();
      if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        localStorage.removeItem("userName");

        alert("Đã đăng xuất thành công!");
        location.reload();
      }
    };
  }
}

// --- QUẢN LÝ GIỎ HÀNG ---
function getCart() {
  return JSON.parse(localStorage.getItem("CineForge_Cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("CineForge_Cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce(
    (sum, item) => sum + (parseInt(item.quantity) || 1),
    0,
  );

  const cartBtns = document.querySelectorAll(
    ".cart-btn, a[href*='gio_hang.html']",
  );
  cartBtns.forEach((btn) => {
    btn.textContent = `Giỏ hàng (${totalItems})`;
  });
}

// Hàm Thêm Giỏ Hàng
function addToCartCustom(button) {
  const name = button.getAttribute("data-name");
  const fileUrl = button.getAttribute("data-file");
  const price = parseInt(button.getAttribute("data-price"));

  let cart = getCart();
  const existing = cart.find((item) => item.name === name);

  if (existing) {
    existing.quantity = (parseInt(existing.quantity) || 1) + 1;
  } else {
    cart.push({ name: name, fileUrl: fileUrl, price: price, quantity: 1 });
  }

  saveCart(cart);
  localStorage.setItem(
    "CineForge_Product",
    JSON.stringify({ name, fileUrl, price }),
  );

  alert("Đã thêm sản phẩm vào giỏ hàng thành công!");
}

// Hàm Mua Ngay trực tiếp chuyển sang trang thanh toán QR
function buyNowDirect(button) {
  const name = button.getAttribute("data-name");
  const fileUrl = button.getAttribute("data-file");
  const price = button.getAttribute("data-price");

  const product = {
    name: name,
    fileUrl: fileUrl,
    price: parseInt(price) || 0,
  };

  localStorage.setItem("CineForge_Product", JSON.stringify(product));
  localStorage.removeItem("CineForge_Paid");

  window.location.href = "thanh_toan.html";
}