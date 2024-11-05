$(document).ready(function () {

  /**  3자리 수마다 콤마 적용 **/
  $(document).on('keyup', 'input[inputmode=numeric]', function () {
    this.value = this.value.replace(/[^0-9]/g, ''); // 입력값이 숫자가 아니면 공백
    this.value = this.value.replace(/,/g, ''); // ,값 공백처리
    this.value = this.value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 정규식을 이용해서 3자리 마다 , 추가
  });

  /*********************************************************************
  on/off 기능
  *********************************************************************/
  /** 툴팁 **/
  $(".info-tooltip").on('click', function () {
    var $this = $(this).parents(".tooltip-wrap");
    $this.toggleClass('on');
  });

  //툴팁 닫기
  $(".tooltip-close").on('click', function () {
    var $this = $(this).parents(".tooltip-wrap");
    $this.removeClass('on');
  });

  // 견적추가 on/off
  document.querySelectorAll('.grid-list-wrap.style3 .grid-list-header').forEach(function (header) {
    header.addEventListener('click', function () {
      header.classList.toggle('on');
    });
  });

  // 견적서 보기
  $(document).on('click', '.show-estimate-wrap .btn-estimate', function () {
    var estimateSection = document.querySelector('.estimate');
    var button = this;

    if (estimateSection.style.display === 'none') {
      estimateSection.style.display = 'block';
      button.textContent = '견적서 접기';
    } else {
      estimateSection.style.display = 'none';
      button.textContent = '견적서 보기';
    }
    // 이미지 방향 변경 로직
    if (button.classList.contains('rotate')) {
      button.classList.remove('rotate');
    } else {
      button.classList.add('rotate');
    }
  });

  // 페이지 로드 시 초기 상태를 확인
  document.addEventListener('DOMContentLoaded', function () {
    if (inputField.value.trim() !== "") {
      myButton.classList.add('active');
      myButton.disabled = false; // 버튼 활성화
    } else {
      myButton.classList.remove('active');
      myButton.disabled = true; // 버튼 비활성화
    }
  });

  // 다중 선택(checkbox 사용 안함)
  document.querySelectorAll('.choose-group.model .choose li').forEach(function(li) {
    li.addEventListener('click', function () {
      li.classList.toggle('chk');
    });
  });

  /*********************************************************************
  input
  *********************************************************************/

  /** input focus **/
  $('.form-control, textarea').focus(function () {
    if (!$(this).hasClass('select') && !$(this).prop("readonly")) {
      $('.fixed-btn-wrap').hide();
    }
  });

  $('.form-control, textarea').blur(function () {
    if (!$(this).hasClass('select') && !$(this).prop("readonly")) {
      $('.fixed-btn-wrap').show();
    }
  });

  /** keyboard focus **/
  $(document).keydown(function (event) {
    if (event.key === "Escape") {
      var inputField = $("input.form-control");
      inputField.blur();
    }
  });

  /** popup focus **/
  // $('.layerpopup.layer-up .form-control').focus(function(){
  //   $('.ly-cont-wrap.ly-scroll-con').removeClass('plus-height2').addClass('plus-height3');
  // });

  // $('.layerpopup.layer-up .form-control').blur(function(){
  //   $('.ly-cont-wrap.ly-scroll-con').addClass('plus-height2').removeClass('plus-height3');
  // });

  /** 리스트 선택이 필요한 경우 **/
  // $(document).on('click', '.txt-list-wrap.click .txt-detail-area', function () {
  //   $('.txt-list-wrap.click .txt-detail-area').not(this).removeClass('on');
  //   $(this).toggleClass('on');
  //   $('.txt-list-wrap.click .txt-detail-area').not(this).find('input').removeClass('on');
  //   $(this).find('input').toggleClass('on');
  // });

  /** 테이블 상세현황 **/
  // $(".table-type.check tbody tr").click(function () {
  //   $(".table-type.check tbody tr").not(this).removeClass("checked");
  //   $(this).toggleClass("checked");
  //   $(".table-type.result").css("display", $(this).hasClass("checked") ? "block" : "none");
  // });

  /** 전체동의 **/
  $('.check.all').on('click', function () {
    var termsPopID = $(this).attr("terms-all");

    if ($(this).prop("checked")) {
      $("#" + termsPopID).closest('.layerpopup').show();
    } else {
      $("#" + termsPopID).closest('.layerpopup').hide();
    }

    if (!$('.level1 .all').closest('fieldset').siblings().hasClass('etc')) {
      // 약관 전체동의
      $('.level2').find('input').prop('checked', $(this).prop('checked'));
    }
  });

  /** 개별 약관 **/
  $('.check').on('click', function () {
    var totalNum = $(".level2 fieldset > .check").length;
    var checkNum = $(".level2 fieldset > .check:checked").length;

    var terms_id = $(this).attr("terms-pop");

    $('.level1 .all').prop('checked', totalNum === checkNum);

    if ($(this).prop("checked")) {
      $("#" + terms_id).closest('.layerpopup').show();
    } else {
      $("#" + terms_id).closest('.layerpopup').hide();
    }

    if (!$(this).closest('div.level3').hasClass('etc')) {
      $('.level1 .all').prop('checked', totalNum === checkNum);
    } else {
      agreeChek();
    }
  });

  /*********************************************************************
  tab
  *********************************************************************/
  /** tab & tab scroll **/
  // 상위 탭 클릭 처리 (견적, 심사 등 상위 탭)
  $(".tab-item > li").click(function() {
    var tabCont = $(this).attr("data-tab");

    // 상위 탭 상태 업데이트
    $(this).siblings().removeClass("on").attr("aria-selected", "false"); // 비활성화된 상위 탭
    if (!$(this).hasClass('swiper')) {
        $(this).addClass("on").attr("aria-selected", "true"); // 활성화된 상위 탭
    }

    // 상위 탭 콘텐츠만 업데이트 (상위 탭 콘텐츠만 처리)
    $(this).closest(".tab-area").find(".tab-content").addClass("dp-none");// 메인 탭 추가
    $(this).closest(".tabs-wrap").find(".tab-content-area > .tab-content").addClass("dp-none");
    $("#" + tabCont).removeClass("dp-none"); // 선택된 상위 탭 콘텐츠 표시
  });

  // 하위 탭 클릭 처리 (예: 심사 안의 심사승인, 심사협의 등 하위 탭)
  $(".tab-item02 > li").click(function() {
    var subTabCont = $(this).attr("data-tab");

    // 하위 탭 상태 업데이트
    $(this).siblings().removeClass("on").attr("aria-selected", "false"); // 비활성화된 하위 탭
    $(this).addClass("on").attr("aria-selected", "true"); // 활성화된 하위 탭

    // 하위 탭 콘텐츠만 업데이트 (하위 탭 콘텐츠만 처리)
    // 문제 있는 부분 확인 후 탐색 범위 수정
    var $tabContentArea = $(this).closest('.tabs.type2').find('.tab-content-area02'); // 탐색 범위 확실히 설정
    $tabContentArea.find(".tab-content").addClass("dp-none"); // 모든 하위 콘텐츠 숨김
    $("#" + subTabCont).removeClass("dp-none"); // 선택된 하위 탭 콘텐츠 표시
  });

  // 초기화: 모든 탭에 role과 tabindex 속성 추가
  $(".tab-item > li, .tab-item02 > li").each(function() {
    $(this).attr({
        role: "tab",
        tabindex: "0", // 탭이 포커스를 받을 수 있도록 설정
        "aria-selected": "false" // 기본적으로 비활성 상태로 설정
    });
  });

  // 활성화된 탭에 대한 aria-selected 업데이트
  $(".tab-item > li.on, .tab-item02 > li.on").attr("aria-selected", "true");
});

/*********************************************************************
팝업 #popup
*********************************************************************/
// 레이어팝업 높이 판단하여 block과 position 컨트롤
function layerFunc(_target) {
  if (!_target.hasClass('laypop-all')) {
    if (_target.outerHeight() > $(window).height()) {
      console.log('Full screen layer required');
      addBlock('full');
    } else {
      if (_target.attr('id') === "loadingLayer") {
        console.log('Loading layer detected');
        addBlock('removeEvent');
      } else if (_target.attr('id') === "customAlertLayer") {
        console.log('Custom alert layer detected');
        addBlock('fixed');
      } else {
        console.log('Regular layer');
        addBlock();
      }
    }
  } else {
    console.log('Skipping laypop-all class');
  }
}

// block 추가 및 삭제
function addBlock(_full) {
  console.log('Adding block:', _full);
  // 블록 추가 로직 필요 시 구현
  // 예: $('body').append('<div class="block"></div>');

  // close 버튼에 이벤트 추가
  $('.close').on('click', function () {
    $('.block').trigger('click');
  });
}

function deleteBlock(_full) {
  console.log('Deleting block:', _full);
  if (_full === 'fixed') {
    $('.block').fadeOut(300).remove();
  }
  $('html, .wrap').css({ 'height': '', 'overflow': '' });
  $('body').removeAttr('style');
}

function messagePopup(id) {
  const _target = $('#' + id);
  const currentTop = $(window).scrollTop();

  // 스크롤 방지
  $('body').css({ 'position': 'fixed', 'top': -currentTop + 'px' });

  _target.find('.btn-layer-close, .btn-close, .confirm').off('click').on('click', function () {
    closePopup(id, currentTop);

    let isEmptyField = false;

    $('input, textarea, select').each(function() {
      if ($(this).val().trim() === "") {
        // 포커스 설정
        $(this).focus();

        // 포커스된 인풋으로 스크롤 이동
        let $this = $('input, textarea, select').on('focus', function() {
          let offset = $(this).offset();
          console.log('Focused input position:', offset.top, offset.left);
        });

        setTimeout(function() {
          $('html, body').animate({
            scrollTop: $this.offset().top
          }, 500);
        }, 0);

        isEmptyField = true;
        return false; // 루프 중지
      }
    });
  });//off('click')추가(기존 이벤트를 제거한 뒤 바인딩)

  _target.fadeIn(600).addClass('on').focus();
}

// 팝업 열기 및 닫기
let scrollPosition = 0;

function openPopup(id) {
  const $target = $('#' + id);

  if ($target.length) {
    // 현재 스크롤 위치 저장
    scrollPosition = $(window).scrollTop();
    console.log('Scroll position saved:', scrollPosition);

    // header-wrap before 뒤로가게
    // $('.layerpopup').css('z-index', '201');

    showPopup($target);
  } else {
    console.error('Target element not found:', id);
  }

  function showPopup($target) {
    layerFunc($target);
    $target.removeClass('close').addClass('on').show().focus();

    // swiper 추가
    var swiper = new Swiper(".mySwiper", {
      slidesPerView: 'auto', // Default
      spaceBetween: 10,
      pagination: {
          el: ".swiper-pagination",
          type: "fraction"
      },
      navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
      }
    });

    // close 버튼에 이벤트 추가
    $target.find('.btn-layer-close, .btn-close, .confirm').on('click', function () {
      closePopup(id);
    });
  }
}

function closePopup(id, storedScrollPosition) {
  const $target = $('#' + id);

  deleteBlock();
  $target.fadeOut(200).removeClass('on');

  // header-wrap의 z-index 복원
  // $('.header-wrap').css('z-index', '999');

  // 스크롤 위치 복원 및 스타일 초기화
  $('body').css({
    'overflow': '',
    'position': '',
    'top': ''
  });

  // 스크롤 위치 복원
  if (storedScrollPosition !== undefined) {
    console.log('Restoring scroll position:', storedScrollPosition);
    $(window).scrollTop(storedScrollPosition);
  }
}

function closePopupUp(id) {
  deleteBlock();
  $('#' + id).scrollTop(0).fadeOut(600);
}
