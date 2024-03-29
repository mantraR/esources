(function ($, window, document, undefined) {
  var gridContainer = $("#grid-container"),
    filtersContainer = $("#filters-container");
  // init cubeportfolio
  gridContainer.cubeportfolio({
    animationType: "fadeOutTop",
    gapHorizontal: 80,
    gapVertical: 0,
    gridAdjustment: "responsive",
    caption: "zoom",
    displayType: "lazyLoading",
    displayTypeSpeed: 100,
    // lightbox
    lightboxDelegate: ".cbp-lightbox",
    lightboxGallery: true,
    lightboxTitleSrc: "data-title",
    lightboxShowCounter: false,
    // singlePage popup
    singlePageDelegate: ".cbp-singlePage",
    singlePageDeeplinking: true,
    singlePageStickyNavigation: true,
    singlePageShowCounter: true,
    singlePageCallback: function (url, element) {
      // to update singlePage content use the following method: this.updateSinglePage(yourContent)
    },
    // singlePageInline
    singlePageInlineDelegate: ".cbp-singlePageInline",
    singlePageInlinePosition: "above",
    singlePageInlineShowCounter: true,
    singlePageInlineCallback: function (url, element) {
      // to update singlePageInline content use the following method: this.updateSinglePageInline(yourContent)
    },
  });
  // add listener for load more click
  $(".cbp-l-loadMore-button-link").on("click", function (e) {
    e.preventDefault();

    var clicks,
      me = $(this),
      oMsg;

    if (me.hasClass("cbp-l-loadMore-button-stop")) return;

    // get the number of times the loadMore link has been clicked
    clicks = $.data(this, "numberOfClicks");
    clicks = clicks ? ++clicks : 1;
    $.data(this, "numberOfClicks", clicks);

    // set loading status
    oMsg = me.text();
    me.text("Loading...");

    // perform ajax request
    $.ajax({
      url: me.attr("href"),
      type: "GET",
      dataType: "HTML",
    })
      .done(function (result) {
        var items, itemsNext;

        // find current container
        items = $(result).filter(function () {
          return $(this).is("div" + ".cbp-loadMore-block" + clicks);
        });

        gridContainer.cubeportfolio("appendItems", items.html(), function () {
          // put the original message back
          me.text(oMsg);

          // check if we have more works
          itemsNext = $(result).filter(function () {
            return $(this).is("div" + ".cbp-loadMore-block" + (clicks + 1));
          });

          if (itemsNext.length === 0) {
            me.text("No More Works");
            me.addClass("cbp-l-loadMore-button-stop");
          }
        });
      })
      .fail(function () {
        // error
      });
  });
})(jQuery, window, document);
