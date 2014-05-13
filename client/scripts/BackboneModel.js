var Chat = Backbone.Model.extend({});

var Chats = Backbone.Collection.extend({ 

  model: Chat,

  addToCol: function (msg) {
    this.add(msg);
    this.trigger('newMsgs');
  }
});



var App = Backbone.Model.extend({
  
  initialize: function () {
   this.set('chats', new Chats);
   this.fetchMsgs(this.get('chats'), this);
   setInterval(this.fetchMsgs.bind(this.get('chats'), this.get('chats'), this), 500);
 },

 initiated: false,

  // *** GET MESSAGES FROM NODE SERVER *** //
  fetchMsgs: function (context, app) { 
    $.ajax({
      // url: 'http://127.0.0.1:8080',
      url: 'http://buddybox.azurewebsites.net/'
      type: 'GET',
      success: function (messages) {
        var messages = messages.results;
        // adds messages not already in the Chats collection;
        for (var i = context.models.length ; i < messages.length ; i++) {
          context.add(messages[i]);
        }
      },
      complete: function () {
        // Triggers 'fetchMsgs' once to avoid re-rendering the whole collection
        // ChatsView is listening for fetchedMsgs & rendering
        if (!app.initiated) {
          context.trigger('fetchedMsgs');
          app.initiated = true;
          // else render the newly added messages
        } else { context.trigger('newMsgs'); }
      }
    });
  }

});