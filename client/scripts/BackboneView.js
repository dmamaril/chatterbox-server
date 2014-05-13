var ChatView = Backbone.View.extend({

  template: _.template('<%=username%>: <%=text%>'),

  render: function () { 
    this.$el.html (this.template(this.model.toJSON())); 
    return this;
  }
});


var ChatsView = Backbone.View.extend({
  el: '#chats',
  // counter keeps track of already rendered messages to render only new msgs
  counter: 0,

  initialize: function () {
    this.collection.on('fetchedMsgs', this.render, this);
    this.collection.on('newMsgs', this.renderNewMsgs, this);
  },

  renderNewMsgs: function () {
    for (var i = this.counter ; i < this.collection.models.length ; i++) {
      var chatView = new ChatView ({ model: this.collection.models[i] });
      this.$el.append( chatView.render().el );
      this.counter++;
    }
  },

  render: function () {
    this.collection.each(function (msg) {
      var chatView = new ChatView ({ model: msg });
      this.$el.append( chatView.render().el );
      this.counter = this.collection.length;
    }, this);
    return this;
  }

});

var InputView = Backbone.View.extend({
  el: '#inputMsg',

  tagName: 'form',

  events: {
    'click button' : 'sendMsg',
    'keypress input' : 'sendMsg'
  },

  sendMsg: function (e) {
    if (e.which == 13) {
      this.message.text = $('input').val();
      this.message.createdAt = new Date;
      this.sendToServer(this.message, this.collection);
      $('input').val('');
    } else if (e.type === 'click') {
      this.message.text = $('input').val(); 
      this.message.createdAt = new Date;
      this.sendToServer(this.message, this.collection);
      $('input').val('');
    }
  },

  // *** SEND {MESSAGE} TO NODE SERVER *** //
  sendToServer: function (message, collection) {
    $.ajax({
      // url: 'http://127.0.0.1:8080',
      url: 'http://buddybox.azurewebsites.net/'
      type: 'POST',
      data: JSON.stringify(message),
      complete: function () {
        collection.addToCol(message);
      }
    });
  },

  initialize: function () {
    this.username = prompt('Username pls?');
    this.message = { username: this.username };
    this.render();
  },

  template: _.template('<input type="text" placeholder="chatter here!"></input><button>Submit</button>'),

  render: function () {
    this.$el.html( this.template );
    return this;
  }
}); 


var AppView = Backbone.View.extend({

  initialize: function () {
    this.chatsView = new ChatsView({ collection: this.model.get('chats') });
    this.inputView = new InputView({ collection: this.model.get('chats') });
  },

  render: function () { return this.$el.html(this.chatsView.$el); }

});


