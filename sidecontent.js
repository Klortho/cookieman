(function($) {

  // These are the settings that can be changed by the user:
  var defaults = {
    class: "sidecontent",
    attachTo: "right",
    width: "300px",
    opacity: 0.8,
    pulloutPadding: 5,
    textDirection: "vertical",
    clickAwayClose: false,
    speed: 300,
  };

  // Every slider instance has a config object that has its current settings
  // (keys per the `defaults` object above) plus several other data items for
  // convenience. It is attached as .data('config') on most of the jQuery 
  // elements, for easy access.

  // Things in the config besides the options:
  // - content - jQuery wrapper of original, user-supplied DOM element
  // - num - sequential id number for one instance
  // - title - from the @title attribute
  // - sliderId - e.g. "sidecontent_0"
  // - slider - jQuery wrapper of DOM node with sliderId
  // - pulloutId - e.g. "sidecontent_0_pullout"
  // - pullout - jQuery wrapped element - the "tab" of the pullout
  // - pulloutWidth
  // - pulloutTop
  // - pulloutHeight

  // Store each config object as an array
  var configs = [];

  // The accumulated pullout height, which is the top of the next pullout, if
  // there is one.
  // FIXME: The purpose of this is so that new tabs show up under existing ones,
  // but I don't think it takes into account which sides they are attached to. 
  var pulloutColumnBottom = 0;
  
  function CloseSliders(thisSliderId) {
    var thisSlider = $('#' + thisSliderId);

    // Reset all sliders, not just the one we're called on
    configs.forEach(function(config) {
      var sliderId = config.sliderId;
      var pulloutId = sliderId + "_pullout";

      var slider = $("#" + sliderId),
          config = slider.data('config'),
          speed = config.speed;
      
      // Only reset it if it is shown
      if (slider.width() > 0) {
        // Close the slider
        slider.animate({width: "0px"}, speed);
        var pullout = config.pullout;
        if (config.attachTo == "left") {
          pullout.animate({left: "0px"}, speed);
        } 
        else {
          pullout.animate({right: "0px"}, speed);
        }
      }
    });
  }
  
  function ToggleSlider () {
    // `this` is the pullout
    var config = $(this).data('config'),
        slider = config.slider,
        speed = config.speed;

    var showSlider = slider.width() <= 0;
    
    CloseSliders(config.sliderId);
    
    if (showSlider) {
      slider.animate({width: config.width}, speed);
      var pullout = config.pullout;
      if (config.attachTo == "left") {
        pullout.animate({left: config.width}, speed);
      } 
      else {
        pullout.animate({right: config.width}, speed);
      }
    }    
    return false;
  };


  $.fn.sidecontent = function(opts) {
    return this.each(function () {
      var config = $.extend({}, defaults, opts);
      var content = config.content = $(this);
      content.data('config', config);
      var num = config.num = configs.length;
      configs.push(config);
      
      // Hide the content to avoid flickering
      content.css({ opacity: 0 });
      
      // Get the title for the pullout
      title = config.title = content.attr("title");
      var htmlTitle = (config.textDirection == "vertical") 
        ? (title.split('').map(function(char) {
            return '<span>' + (char === ' ' ? '&nbsp;' : char) + '</span>';
          })).join('')
        : title;
      
      // Wrap the content in a slider and add a pullout     
      var _class = config.class,
          sliderId = config.sliderId = _class + "_" + num;
      content.wrap('<div class="' + _class + '" id="' + 
        sliderId + '"></div>')
      .wrap('<div style="width: ' + config.width + '"></div>');

      var slider = config.slider = $("#" + sliderId);
      slider.data('config', config);

      var pulloutId = config.pulloutId = sliderId + '_pullout';
      slider.before(
        '<div class="' + _class + 'pullout" id="' + 
        sliderId + '_pullout" rel="' + num + '">' + htmlTitle + 
        '</div>'
      );
      var pullout = config.pullout = $('#' + pulloutId);
      pullout.data('config', config);

      if (config.textDirection == 'vertical') {
        $("#" + sliderId + "_pullout span").css({
          display: "block",
          textAlign: "center"
        });
      }
      
      // Hide the slider
      slider.css({
        position: "absolute",
        overflow: "hidden",
        top: "0",
        width: "0px",
        zIndex: "1",
        opacity: config.opacity
      });
      
      // For left-side attachment
      var attachTo = config.attachTo;
      if (attachTo == "left") {
        slider.css({ left: "0px" });
      } 
      else {
        slider.css({ right: "0px" });
      }
    
      // Start the pulloutHeight with the configured padding
      var pulloutTop = config.pulloutTop =
        pulloutColumnBottom + parseInt(config.pulloutPadding);

      // Set up the pullout
      pullout.css({
        position: "absolute",
        top: pulloutTop + "px",
        zIndex: "1000",
        cursor: "pointer",
        opacity: config.opacity
      });
      pullout.on("click", ToggleSlider);
      
      var pulloutWidth = config.pulloutWidth = 
        $("#" + sliderId + "_pullout").width();
      
      // For left-side attachment
      if (attachTo == "left") {
        $("#" + sliderId + "_pullout").css({
          left: "0px",
          width: pulloutWidth + "px"
        });
      } 
      else {
        $("#" + sliderId + "_pullout").css({
          right: "0px",
          width: pulloutWidth + "px"
        });
      }
      
      var pulloutHeight = config.pulloutHeight = pullout.height();
      pulloutColumnBottom += 2 * config.pulloutPadding + pulloutHeight;

      var minHeight = pulloutColumnBottom + 30;
      if (minHeight > slider.height()) {
        slider.css({height: minHeight + "px"});
      }
      
      if (config.clickAwayClose) {
        $("body").click(function() {
          CloseSliders("");
        });
      }
      
      // Put the content back now it is in position
      content.css({ opacity: 1 });
    });
    
    return this;
  };

  // helper functions
  function assert(p, msg) {
    if (!p) throw Error('assertion failed' + (msg ? ': ' + msg : ''));
  }

})(jQuery);