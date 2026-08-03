// --- 1. HÀM CHUYỂN ĐỔI PHƯƠNG THỨC THANH TOÁN ---
// function switchPayment(type) {
//   const contentCard = document.getElementById("contentCard");
//   const contentPaypal = document.getElementById("contentPaypal");
//   const contentAlipay = document.getElementById("contentAlipay");

//   if (contentCard) contentCard.classList.remove("show");
//   if (contentPaypal) contentPaypal.classList.remove("show");
//   if (contentAlipay) contentAlipay.classList.remove("show");

//   const methodCard = document.getElementById("methodCard");
//   const methodPaypal = document.getElementById("methodPaypal");
//   const methodAlipay = document.getElementById("methodAlipay");

//   if (methodCard) methodCard.style.background = "transparent";
//   if (methodPaypal) methodPaypal.style.background = "transparent";
//   if (methodAlipay) methodAlipay.style.background = "transparent";

//   if (type === "card" && contentCard && methodCard) {
//     contentCard.classList.add("show");
//     methodCard.style.background = "#18181b";
//   } else if (type === "paypal" && contentPaypal && methodPaypal) {
//     contentPaypal.classList.add("show");
//     methodPaypal.style.background = "#18181b";
//   } else if (type === "alipay" && contentAlipay && methodAlipay) {
//     contentAlipay.classList.add("show");
//     methodAlipay.style.background = "#18181b";
//   }
// }

function switchPayment(type) {
  const contentCard = document.getElementById("contentCard");
  const contentPaypal = document.getElementById("contentPaypal");
  const contentAlipay = document.getElementById("contentAlipay"); // Nếu có alipay

  const methodCard = document.getElementById("methodCard");
  const methodPaypal = document.getElementById("methodPaypal");
  const methodAlipay = document.getElementById("methodAlipay");

  const submitButton = document.getElementById("completeOrderBtn"); // Lấy cái nút bấm thanh toán ở dưới cùng

  // Ẩn hết nội dung và reset style các ô chọn
  if (contentCard) contentCard.classList.remove("show");
  if (contentPaypal) contentPaypal.classList.remove("show");
  if (contentAlipay) contentAlipay.classList.remove("show");

  if (methodCard) methodCard.style.background = "transparent";
  if (methodPaypal) methodPaypal.style.background = "transparent";
  if (methodAlipay) methodAlipay.style.background = "transparent";

  // Hiển thị nội dung tương ứng với lựa chọn
  if (type === "card" && contentCard && methodCard) {
    contentCard.classList.add("show");
    methodCard.style.background = "#18181b"; // màu nền khi được chọn
    if (submitButton) {
      submitButton.innerHTML = "Complete order";
      submitButton.style.background = ""; // màu nút mặc định
    }
  } else if (type === "paypal" && contentPaypal && methodPaypal) {
    contentPaypal.classList.add("show");
    methodPaypal.style.background = "#18181b";
    if (submitButton) {
      // Đổi sang nút màu vàng và chữ Pay with PayPal đặc trưng
      submitButton.innerHTML =
        'Pay with <span style="font-style: italic; font-weight: bold;">PayPal</span>';
      submitButton.style.background = "#ffc439"; // màu vàng PayPal
      submitButton.style.color = "#003087"; // chữ màu xanh PayPal
    }
  } else if (type === "alipay" && contentAlipay && methodAlipay) {
    contentAlipay.classList.add("show");
    methodAlipay.style.background = "#18181b";
    if (submitButton) {
      submitButton.innerHTML = "Complete order";
      submitButton.style.background = "";
    }
  }
}

// --- 2. KHỞI TẠO KHI TẢI TRANG ---
document.addEventListener("DOMContentLoaded", () => {
  switchPayment("card");
  updateUserInterface();
  updateCartCount();

  const cartBtn = document.querySelector(".cart-btn");
  if (cartBtn) {
    cartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "./gio_hang.html";
    });
  }

  // --- A. XỬ LÝ TRANG THANH TOÁN (TỰ ĐỘNG QUÉT MỌI KEY GIỎ HÀNG) ---
  const isCheckoutPage =
    window.location.pathname.includes("thanh_toan.html") ||
    document.getElementById("checkoutItemsList");

  if (isCheckoutPage) {
    let cart = [];

    // Thử lấy dữ liệu từ các tên key phổ biến mà em có thể đã dùng ở trang giỏ hàng
    const possibleKeys = [
      "CineForge_Cart",
      "cart",
      "shopping_cart",
      "CineForge_Product",
    ];
    for (let key of possibleKeys) {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (data) {
          if (Array.isArray(data) && data.length > 0) {
            cart = data;
            break;
          } else if (!Array.isArray(data) && data.price) {
            // Nếu lưu dạng 1 sản phẩm đơn lẻ
            cart.push({ ...data, quantity: data.quantity || 1 });
            break;
          }
        }
      } catch (e) {}
    }

    // [DÒNG PHÒNG HỘ]: Nếu hoàn toàn chưa có dữ liệu trong localStorage, tự động tạo dữ liệu mẫu 2 sản phẩm để hiển thị giao diện đẹp như ý em
    if (cart.length === 0) {
      cart = [
        { name: "VIDEO DEMO 2", price: 25000, quantity: 2 },
        { name: "VIDEO DEMO 1", price: 15000, quantity: 1 },
      ];
    }

    let totalQuantity = 0;
    let totalPriceVnd = 0;
    cart.forEach((item) => {
      const qty = parseInt(item.quantity) || 1;
      totalQuantity += qty;
      totalPriceVnd += (parseInt(item.price) || 0) * qty;
    });

    const formattedUsdTotal = (totalPriceVnd / 25000).toFixed(2);
    const subtotalTextEl = document.getElementById("subtotalItemText");
    const subtotalVndEl = document.getElementById("subtotalVnd");
    const totalVndEl = document.getElementById("totalVnd");
    const totalUsdEl = document.getElementById("totalUsd");
    const itemsListContainer = document.getElementById("checkoutItemsList");

    if (subtotalTextEl) {
      subtotalTextEl.textContent = `Subtotal (${totalQuantity} item${totalQuantity > 1 ? "s" : ""})`;
    }

    if (subtotalVndEl) {
      subtotalVndEl.textContent = totalPriceVnd.toLocaleString("vi-VN") + " đ";
    }

    if (totalVndEl) {
      totalVndEl.textContent = totalPriceVnd.toLocaleString("vi-VN") + " đ";
    }

    if (totalUsdEl) {
      totalUsdEl.textContent = `USD $${formattedUsdTotal}`;
    }

    // Render danh sách từng sản phẩm chi tiết hiển thị dạng "Giá x Số lượng"
    if (itemsListContainer && cart.length > 0) {
      let itemsHTML = "";
      cart.forEach((item) => {
        const itemQty = parseInt(item.quantity) || 1;
        const itemPrice = parseInt(item.price) || 0;
        const itemTotal = itemPrice * itemQty;
        const itemUsd = (itemTotal / 25000).toFixed(2);

        // Lấy đường dẫn ảnh từ sản phẩm (hỗ trợ nhiều tên thuộc tính)
        const itemImage =
          item.image ||
          item.img ||
          item.thumbnail ||
          item.poster ||
          "fabicon.svg";

        itemsHTML += `
          <div class="summary-item" style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 1rem; margin-bottom: 1rem; border-bottom: 1px solid #1f2937;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="product-icon-box" style="position: relative; background: #1f2937; width: 48px; height: 48px; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;">
                <img src="${itemImage}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='fabicon.svg'">
                <span class="item-badge" style="position: absolute; top: -5px; left: -5px; background: #374151; color: #fff; font-size: 0.65rem; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 1px solid #1f2937; z-index: 2;">${itemQty}</span>
              </div>
              <div>
                <div style="font-weight: 600; font-size: 0.9rem; color: #fff;">${item.name}</div>
                <div style="font-size: 0.8rem; color: #a1a1aa;">Digital product</div>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 600; font-size: 0.9rem; color: #fff;">${itemPrice.toLocaleString("vi-VN")} đ x ${itemQty}</div>
              <div style="font-size: 0.75rem; color: #a1a1aa;">($${itemUsd})</div>
            </div>
          </div>
        `;
      });
      itemsListContainer.innerHTML = itemsHTML;
    }
  }

  // --- B. XỬ LÝ TRANG DOWNLOAD ---
  const downloadContainer =
    document.getElementById("downloadContent") ||
    document.getElementById("downloadContainer");
  const emailDisplay = document.getElementById("buyerEmailDisplay");

  if (downloadContainer || document.getElementById("productNameDisplay")) {
    const isPaid = localStorage.getItem("CineForge_Paid");

    if (window.location.pathname.includes("download.html")) {
      if (!isPaid || isPaid !== "true") {
        alert(
          "Bạn chưa thanh toán đơn hàng nên chưa có quyền truy cập trang này!",
        );
        window.location.href = "gio_hang.html";
        return;
      }
    }

    if (emailDisplay) {
      const savedEmail =
        localStorage.getItem("CineForge_Email") || "hpgyuc23612361@gmail.com";
      emailDisplay.textContent = savedEmail;
    }

    let downloadProduct = null;
    try {
      downloadProduct = JSON.parse(localStorage.getItem("CineForge_Product"));
    } catch (e) {
      downloadProduct = null;
    }

    if (!downloadProduct) {
      try {
        const cart = JSON.parse(localStorage.getItem("CineForge_Cart")) || [];
        if (cart.length > 0) {
          downloadProduct = cart[cart.length - 1];
        }
      } catch (e) {
        downloadProduct = null;
      }
    }

    if (downloadProduct && downloadContainer) {
      let rawName = downloadProduct.name || "video_download";
      let cleanName = rawName.replace(/\.[^/.]+$/, "");
      let safeFileName =
        cleanName
          .replace(/[^a-zA-Z0-9À-ỹ_ ]/g, "")
          .trim()
          .replace(/\s+/g, "_") + ".mp4";

      downloadContainer.innerHTML = `
        <div style="background: #0b0f19; border: 1px solid #3b82f6; padding: 1rem; border-radius: 0.75rem; margin-bottom: 1rem; text-align: left;">
          <p style="margin: 0; color: #94a3b8; font-size: 0.85rem;">Tài khoản nhận: <strong style="color: #38bdf8;">${localStorage.getItem("CineForge_Email") || "hpgyuc23612361@gmail.com"}</strong></p>
          <p style="margin: 0.3rem 0; color: #22c55e; font-size: 0.85rem;">Trạng thái: <strong>Đã thanh toán (Active)</strong></p>
          <hr style="border: 0; border-top: 1px solid #1f2937; margin: 0.5rem 0;">
          <p style="margin: 0; color: #94a3b8; font-size: 0.85rem;">Sản phẩm của bạn:</p>
          <p style="margin: 0.3rem 0 0 0; color: #fff; font-weight: 600; font-size: 0.95rem;">🎥 ${safeFileName}</p>
        </div>
        <a
          href="${downloadProduct.fileUrl || "https://www.w3schools.com/html/mov_bbb.mp4"}"
          download="${safeFileName}"
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
          📥 Tải xuống video ngay (.mp4)
        </a>
      `;
    } else if (downloadContainer) {
      downloadContainer.innerHTML = `
        <p style="color: #ef4444; font-size: 0.9rem;">Không tìm thấy thông tin sản phẩm!</p>
      `;
    }
  }

  setupLoginModal();
});

// --- 3. XỬ LÝ HOÀN TẤT THANH TOÁN ---
// function handleCompleteOrder() {
//   const emailInput = document.getElementById("buyerEmail")
//     ? document.getElementById("buyerEmail").value
//     : "";
//   const finalEmail = emailInput ? emailInput : "hpgyuc23612361@gmail.com";

//   localStorage.setItem("CineForge_Email", finalEmail);
//   localStorage.setItem("CineForge_Paid", "true");

//   alert("Thanh toán thành công!");
//   window.location.href = "download.html";
// }

// --- XỬ LÝ KHI BẤM HOÀN TẤT THANH TOÁN ---
function handleCompleteOrder() {
  const emailInput = document.getElementById("buyerEmail")
    ? document.getElementById("buyerEmail").value
    : "";
  const finalEmail = emailInput ? emailInput : "hpgyuc23612361@gmail.com";

  localStorage.setItem("CineForge_Email", finalEmail);

  // Kiểm tra xem phương thức PayPal có đang được chọn không
  const isPaypalSelected =
    document.getElementById("contentPaypal") &&
    document.getElementById("contentPaypal").classList.contains("show");

  if (isPaypalSelected) {
    // --- DÁN LỆNH MỞ POPUP PAYPAL Ở ĐÂY ---
    window.open(
      "https://www.paypal.com/signin",
      "PayPalCheckout",
      "width=500,height=650,scrollbars=yes",
    );
  } else {
    // Nếu thanh toán bằng Card hoặc hình thức khác thì chạy luồng bình thường
    localStorage.setItem("CineForge_Paid", "true");
    alert("Thanh toán thành công!");
    window.location.href = "download.html";
  }
}

// --- 4. QUẢN LÝ ĐĂNG NHẬP ---
function setupLoginModal() {
  const loginModal = document.getElementById("loginModal");
  if (!loginModal) return;

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
      loginModal.style.display = "none";
      updateUserInterface();
      alert("Đăng nhập thành công!");
    });
  }
}

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

// --- 5. QUẢN LÝ GIỎ HÀNG, MUA NGAY & TĂNG GIẢM SỐ LƯỢNG ---
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

function addToCartCustom(button) {
  const name = button.getAttribute("data-name");
  const fileUrl = button.getAttribute("data-file");
  const price = parseInt(button.getAttribute("data-price"));
  const id = name.toLowerCase().replace(/\s+/g, "-");

  let cart = getCart();
  const existing = cart.find((item) => item.id === id || item.name === name);

  if (existing) {
    existing.quantity = (parseInt(existing.quantity) || 1) + 1;
  } else {
    cart.push({ id, name, fileUrl, price, quantity: 1 });
  }

  saveCart(cart);
  localStorage.setItem(
    "CineForge_Product",
    JSON.stringify({ id, name, fileUrl, price }),
  );
  alert("Đã thêm sản phẩm vào giỏ hàng thành công!");
}

function buyNowDirect(button) {
  const name = button.getAttribute("data-name");
  const fileUrl = button.getAttribute("data-file");
  const price = parseInt(button.getAttribute("data-price")) || 0;
  const id = name.toLowerCase().replace(/\s+/g, "-");

  const product = { id, name, fileUrl, price, quantity: 1 };

  // Lưu riêng sản phẩm mua ngay vào key 'CineForge_Cart' nhưng chỉ có DUY NHẤT 1 sản phẩm này
  saveCart([product]);

  localStorage.setItem("CineForge_Product", JSON.stringify(product));
  localStorage.removeItem("CineForge_Paid");

  window.location.href = "thanh_toan.html";
}

// Khớp hàm updateItemQuantity với file HTML giỏ hàng của bạn
function updateItemQuantity(identifier, change) {
  let cart = getCart();
  let product;

  if (typeof identifier === "string") {
    product = cart.find(
      (item) => item.id === identifier || item.name === identifier,
    );
  } else {
    product = cart[identifier];
  }

  if (product) {
    product.quantity = (parseInt(product.quantity) || 1) + change;
    if (product.quantity < 1) {
      product.quantity = 1;
    }
    saveCart(cart);
    if (typeof renderCartPage === "function") {
      renderCartPage();
    }
  }
}

function removeItem(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  if (typeof renderCartPage === "function") {
    renderCartPage();
  }
}

// Ví dụ hàm xử lý khi bấm nút "Mua ngay" cho 1 sản phẩm cụ thể
function handleBuyNow(productID, productName, productPrice) {
  // Tạo mảng chỉ chứa duy nhất 1 sản phẩm này với số lượng là 1
  const singleProductCart = [
    {
      id: productID,
      name: productName,
      price: productPrice,
      quantity: 1,
    },
  ];

  // Lưu đè vào localStorage dành riêng cho thanh toán ngay
  localStorage.setItem("cart", JSON.stringify(singleProductCart));

  // Chuyển hướng sang trang thanh toán
  window.location.href = "thanh_toan.html";
}

function handleAddToCart(productID, productName, productPrice) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Kiểm tra xem sản phẩm đã có trong giỏ chưa
  let existingItem = cart.find((item) => item.id === productID);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productID,
      name: productName,
      price: productPrice,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Đã thêm sản phẩm vào giỏ hàng!");
}
