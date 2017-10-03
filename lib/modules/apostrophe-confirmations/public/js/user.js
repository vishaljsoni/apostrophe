/* global $ */
apos.define('apostrophe-confirmations', {

  extend: 'apostrophe-context',

  construct: function (self) {
    /* @NOTE: Holdover from notification
      // Call with a message, followed by any interpolated strings which must correspond
      // to %s placeholders in `message`.
      //
      // This method is aliased as `apos.notify` for convenience.
      //
      // The message is internationalized by the server, which is why the use of
      // %s placeholders for any inserted titles, etc. is important.
    */

    // Params:
    //  - context where the confirmation is being called.
    //  - message
    //  - Secondary message (optional)
    //  - callback for what happens following confirmation
    //
    //  Target of the confirmation is included in message. See modal.js and
    //  confirmCancel().

    self.trigger = function (context, message, helpText, callback) {
      var strings = [];

      // if ((i === (arguments.length - 1)) && (typeof (arguments[i]) === 'object')) {
      //   options = arguments[i++];
      // } else {
      //   options = {};
      // }

      var $confirmation;
      var $response;
      var responseValue;

      self.html(
        'confirmation',
        { message: message, strings: strings },
        function (data) {
          $confirmation = $($.parseHTML(data));
          $response = $confirmation.find('[data-apos-confirmation-response]');
          console.log($response);

          $response.click(function () {
            responseValue = $response.value;
            console.log(responseValue);
            self.dismiss($confirmation);
          });

          self.addToContainer($confirmation);
        }
      );
    };

    self.createContainer = function () {
      self.$container = $('<div class="apos-confirmation-container" data-apos-confirmation-container></div>');
      self.$container.hide();
      $('body').append(self.$container);
    };

    self.addToContainer = function ($confirmation) {
      self.$container.prepend($confirmation);
      self.$container.show();

      setTimeout(function () {
        $confirmation.removeClass('apos-confirmation--hidden');
      }, 100);
    };

    self.dismiss = function ($confirmation) {
      $confirmation.addClass('apos-confirmation--hidden');

      setTimeout(function () {
        $confirmation.remove();
        if (!self.$container.find('[data-apos-confirmation]').length) {
          self.$container.hide();
        }
      }, 300);
    };
  },

  afterConstruct: function (self) {
    apos.confirm = self.trigger;

    self.createContainer();
  }
});
