/**
 * ============================================================================
 * SIÊU THỊ ĐIỆN MÁY LĨNH THÀNH TÂM - MAIN JAVASCRIPT ENGINE
 * Logic: Responsive Hotline Floating Buttons, Modal ở góc trên bên trái,
 *        Lọc sản phẩm, Countdown Timer, Lightbox, Mobile Nav & Scroll Spy.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. KHỞI TẠO CÁC PHẦN TỬ DOM (DOM REFERENCES)
  // --------------------------------------------------------------------------
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('backToTop');

  // Floating & Hotline Elements
  const floatingPhoneBtn = document.getElementById('floatingPhoneBtn');
  const desktopHotlineModal = document.getElementById('desktopHotlineModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const copyPhoneBtn = document.getElementById('copyPhoneBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const copyIcon = document.getElementById('copyIcon');
  const toastNotice = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMsg');

  // Product Filter Elements
  const tabBtns = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  // Lightbox Elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const quickViewBtns = document.querySelectorAll('.quick-view-btn');
  const prizeCards = document.querySelectorAll('.prize-card');

  // Spinning Wheel & Audio feedback
  const spinningLuckyWheel = document.getElementById('spinningLuckyWheel');

  // --------------------------------------------------------------------------
  // 2. XỬ LÝ LOGIC 2 ICON NỔI & RESPONSIVE HOTLINE (YÊU CẦU ĐẶC BIỆT MỤC 5)
  // --------------------------------------------------------------------------
  /**
   * YÊU CẦU:
   * - Đối với Điện thoại (Mobile screen < 768px):
   *   Nhấp vào icon gọi điện sẽ lập tức kích hoạt cuộc gọi với giao thức tel:0982533155
   * - Đối với Máy tính/Laptop (Desktop screen >= 768px):
   *   Nhấp vào icon gọi điện sẽ bật Modal thông báo ở GÓC TRÊN CÙNG BÊN TAY TRÁI (top: 20px; left: 20px;)
   *   Hiển thị số 0982 533 155 kèm nút "Sao chép số" tiện lợi và nút đóng [X]
   */
  const HOTLINE_NUMBER_CLEAN = '0982533155';
  const HOTLINE_NUMBER_FORMATTED = '0982 533 155';

  if (floatingPhoneBtn) {
    floatingPhoneBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const screenWidth = window.innerWidth;

      if (screenWidth < 768) {
        // TRÊN MOBILE: Kích hoạt ứng dụng cuộc gọi ngay lập tức
        window.location.href = `tel:${HOTLINE_NUMBER_CLEAN}`;
      } else {
        // TRÊN DESKTOP: Bật Modal ở góc trên cùng bên trái màn hình
        openDesktopHotlineModal();
      }
    });
  }

  // Mở modal desktop
  function openDesktopHotlineModal() {
    if (desktopHotlineModal) {
      desktopHotlineModal.classList.add('show');
    }
  }

  // Đóng modal desktop
  function closeDesktopHotlineModal() {
    if (desktopHotlineModal) {
      desktopHotlineModal.classList.remove('show');
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeDesktopHotlineModal);
  }

  // Đóng khi click ngoài modal trên desktop
  document.addEventListener('click', (e) => {
    if (
      desktopHotlineModal &&
      desktopHotlineModal.classList.contains('show') &&
      !desktopHotlineModal.contains(e.target) &&
      e.target !== floatingPhoneBtn &&
      !floatingPhoneBtn.contains(e.target)
    ) {
      closeDesktopHotlineModal();
    }
  });

  // Đóng modal khi nhấn phím ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDesktopHotlineModal();
      closeLightbox();
    }
  });

  // Xử lý sao chép số điện thoại vào Clipboard
  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(HOTLINE_NUMBER_CLEAN);
        } else {
          // Fallback cho trình duyệt cũ
          const tempInput = document.createElement('input');
          tempInput.value = HOTLINE_NUMBER_CLEAN;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        // Cập nhật giao diện nút sao chép
        copyPhoneBtn.classList.add('copied');
        copyBtnText.textContent = '✓ Đã sao chép!';
        copyIcon.className = 'fa-solid fa-check';

        // Hiển thị Toast thông báo nổi
        showToast(`Đã sao chép số Hotline: ${HOTLINE_NUMBER_FORMATTED}`);

        // Trả lại trạng thái ban đầu sau 3 giây
        setTimeout(() => {
          copyPhoneBtn.classList.remove('copied');
          copyBtnText.textContent = 'Sao chép số';
          copyIcon.className = 'fa-regular fa-copy';
        }, 3000);
      } catch (err) {
        showToast(`Hotline: ${HOTLINE_NUMBER_FORMATTED}`);
      }
    });
  }

  // Hàm hiển thị Toast Notification
  function showToast(message) {
    if (!toastNotice) return;
    if (toastMsg) toastMsg.textContent = message;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3500);
  }

  // --------------------------------------------------------------------------
  // 3. NAVBAR, MOBILE MENU & SCROLL BEHAVIOR
  // --------------------------------------------------------------------------
  // Toggle Mobile Menu
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mainNav.classList.toggle('open');
    });

    // Đóng menu khi nhấp vào bất kỳ link nào
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('open');
      });
    });
  }

  // Sticky Navbar Blur & Shrink on Scroll
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (header) {
      if (scrollPos > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Nút Back to top
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }

    // Scrollspy: Cập nhật active link khi cuộn qua từng section
    updateScrollSpy();
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Scrollspy logic
  const sections = document.querySelectorAll('section[id]');
  function updateScrollSpy() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. BỘ ĐẾM NGƯỢC COUNTDOWN TIMER (SỰ KIỆN BỐC THĂM: 07:00 31/01/2027 HÀ NỘI)
  // --------------------------------------------------------------------------
  const cdMonths = document.getElementById('cdMonths');
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');

  // Mốc thời gian trao thưởng cố định: 07:00:00 ngày 31/01/2027 (Giờ Hà Nội, GMT+7)
  const TARGET_DATE = new Date('2027-01-31T07:00:00+07:00');

  function updateCountdown() {
    const now = new Date();
    if (now >= TARGET_DATE) {
      if (cdMonths) cdMonths.textContent = '00';
      if (cdDays) cdDays.textContent = '00';
      if (cdHours) cdHours.textContent = '00';
      if (cdMinutes) cdMinutes.textContent = '00';
      if (cdSeconds) cdSeconds.textContent = '00';
      return;
    }

    // Đếm số tháng tròn từ ngày hiện tại
    let temp = new Date(now.getTime());
    let months = 0;
    while (true) {
      let nextMonth = new Date(temp.getTime());
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      if (nextMonth <= TARGET_DATE) {
        temp = nextMonth;
        months++;
      } else {
        break;
      }
    }

    // Phần dư thời gian còn lại (ngày, giờ, phút, giây)
    let diffMs = TARGET_DATE.getTime() - temp.getTime();
    const msInDay = 1000 * 60 * 60 * 24;
    const msInHour = 1000 * 60 * 60;
    const msInMinute = 1000 * 60;
    const msInSecond = 1000;

    const days = Math.floor(diffMs / msInDay);
    diffMs %= msInDay;

    const hours = Math.floor(diffMs / msInHour);
    diffMs %= msInHour;

    const minutes = Math.floor(diffMs / msInMinute);
    diffMs %= msInMinute;

    const seconds = Math.floor(diffMs / msInSecond);

    if (cdMonths) cdMonths.textContent = String(months).padStart(2, '0');
    if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
    if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
    if (cdMinutes) cdMinutes.textContent = String(minutes).padStart(2, '0');
    if (cdSeconds) cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // --------------------------------------------------------------------------
  // 5. BỘ LỌC DANH MỤC SẢN PHẨM (TABS FILTER)
  // --------------------------------------------------------------------------
  if (tabBtns.length > 0 && productCards.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Cập nhật trạng thái active của tab
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        productCards.forEach(card => {
          const category = card.getAttribute('data-category');

          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
            card.style.animation = 'fadeInUp 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. LIGHTBOX POPUP XEM ẢNH PHÓNG TO
  // --------------------------------------------------------------------------
  function openLightbox(imgSrc, title) {
    if (lightboxModal && lightboxImg) {
      lightboxImg.src = imgSrc;
      if (lightboxCaption) lightboxCaption.textContent = title || 'Ảnh chi tiết showroom';
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Gắn sự kiện cho các nút xem ảnh trên card sản phẩm
  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = btn.getAttribute('data-img');
      const title = btn.getAttribute('data-title');
      openLightbox(imgSrc, title);
    });
  });

  // Cho phép click vào ảnh giải thưởng để xem lớn
  prizeCards.forEach(card => {
    const imgContainer = card.querySelector('.prize-image-container');
    const img = card.querySelector('.prize-img');
    const title = card.querySelector('.prize-title');

    if (imgContainer && img) {
      imgContainer.addEventListener('click', () => {
        openLightbox(img.src, title ? title.textContent : 'Giải thưởng bốc thăm');
      });
    }
  });

  // Cho phép click vào ảnh showroom để xem lớn
  const showroomImgWrapper = document.querySelector('.showroom-image-wrapper');
  if (showroomImgWrapper) {
    showroomImgWrapper.style.cursor = 'pointer';
    showroomImgWrapper.addEventListener('click', () => {
      const mainImg = showroomImgWrapper.querySelector('.showroom-main-img');
      if (mainImg) {
        openLightbox(mainImg.src, 'Toàn Cảnh Showroom Siêu Thị Điện Máy Lĩnh Thành Tâm');
      }
    });
  }

  // Đóng lightbox khi click [X] hoặc nền đen
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  // --------------------------------------------------------------------------
  // 7. LOẠI BỎ TOAST/MODAL KHI CLICK VÀO VÒNG QUAY MAY MẮN
  // --------------------------------------------------------------------------
  // Đã loại bỏ hoàn toàn thông báo trúng giải khi click vào ảnh vòng quay theo yêu cầu

  // Thêm animation fadeInUp vào document head
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(styleSheet);
});

// ----------------------------------------------------------------------------
// 8. XỬ LÝ GỬI FORM TƯ VẤN (GLOBAL HANDLER)
// ----------------------------------------------------------------------------
function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const product = document.getElementById('custProduct').value;

  if (!name || !phone) {
    alert('Vui lòng nhập đầy đủ Họ tên và Số điện thoại!');
    return false;
  }

  // Hiển thị thông báo chuyên nghiệp
  alert(
    `🎉 Cảm ơn Quý khách ${name}!\n\n` +
    `Thông tin tư vấn về "${product}" đã được gửi tới Siêu Thị Điện Máy Lĩnh Thành Tâm.\n` +
    `Chuyên viên chăm sóc sẽ liên hệ lại qua số điện thoại ${phone} trong thời gian sớm nhất.\n\n` +
    `Chúc Quý khách may mắn rước 02 Xe Máy Honda về nhà!`
  );

  document.getElementById('consultForm').reset();
  return false;
}

