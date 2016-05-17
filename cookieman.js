(function($) {
  // These are the settings that can be changed by the user:
  var defaults = {
    cookieName: 'TEST_COOKIE',
  };
  var configs = [];

  function init(config) {
    var content = config.content;
    console.log('calling sidecontent');
    content.sidecontent();
  }
  
  function goButton(event) {
    // Set the cookie
    // ...
    // Reload the page
    window.location.reload();
  }

  function resetButton(event) {
    // Clear the cookie
    // ...
    // Reload the page
    window.location.reload();
  }
  
  function getCookie(name) {
  }
  
  $.fn.cookieman = function (opts) {
    return this.each(function () {
      var config = $.extend({}, defaults, opts);
      var content = config.content = $(this);
      content.data('config', config);
      var num = config.num = configs.length;
      configs.push(config);

      init(config);      
    });
  };
})(jQuery);

