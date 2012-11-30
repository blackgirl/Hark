(function() {

  $(document).delegate('.act-add', 'click', function(e) {
    e.preventDefault();
    return $('.add-feed').toggle();
  });

  $('.add-feed').live('keypress', function(e) {
    var data;
    if (e.which === 13) {
      data = {
        url: $(e.currentTarget).val()
      };
      return $.ajax({
        type: 'POST',
        url: '/listen/add',
        data: data,
        error: function(err) {
          $('#modal').html(err.responseText);
          return $('#modal').fadeIn(500);
        },
        success: function(data) {
          $('.hark-container').html(data);
          $('.add-feed').val('');
          $('.add-feed').hide();
          return window.ajaxHelpers();
        }
      });
    }
  });

  $(document).delegate('.act-update', 'click', function(e) {
    e.preventDefault();
    $('.act-update a').text('Updating...');
    return $.ajax({
      type: 'POST',
      url: '/listen/update',
      error: function(err) {
        $('#modal').html(err.responseText);
        return $('#modal').fadeIn(500);
      },
      success: function(data) {
        $('.act-update a').text('Update');
        $('.primary').html(data);
        return window.ajaxHelpers();
      }
    });
  });

  $(document).delegate('.allFeeds a', 'click', function(e) {
    e.preventDefault();
    return $.ajax({
      type: 'POST',
      url: '/listen/podcast/all',
      success: function(data) {
        $('.primary').html(data);
        return window.ajaxHelpers();
      }
    });
  });

  $(document).delegate('.loadFeed, .loadFeedFromItem', 'click', function(e) {
    var data;
    e.preventDefault();
    data = {
      feedID: $(this).attr('href').split('/')[3]
    };
    return $.ajax({
      type: 'POST',
      data: data,
      url: '/listen/podcast/' + data.feedID,
      success: function(data) {
        $('.primary').html(data);
        return window.ajaxHelpers();
      }
    });
  });

  $(document).delegate('.sidebar-expander', 'click', function(e) {
    if ($(e.currentTarget).is('.expanded')) {
      $(e.currentTarget).next().removeClass('undocked').fadeOut(300);
      $(e.currentTarget).parent().removeClass('active');
      return $(e.currentTarget).removeClass('expanded');
    } else {
      $('.sidebar-action-edit-input').hide();
      $(e.currentTarget).parent().css('overflow', 'visible');
      $(e.currentTarget).next().addClass('undocked').fadeIn(300);
      $(e.currentTarget).parent().addClass('active');
      return $(e.currentTarget).addClass('expanded');
    }
  });

  $(document).delegate('.sidebar-action-edit', 'click', function(e) {
    e.preventDefault();
    $('.sidebar-action-edit-input').val('');
    $('.sidebar-action-edit-input').fadeIn(300);
    return $('.sidebar-action-edit-input').val($(e.currentTarget).parent().siblings('.loadFeed').text());
  });

  $('.sidebar-action-edit-input').live('keypress', function(e) {
    var data;
    if (e.which === 13) {
      data = {
        feedID: $(this).prev().attr('href').split('/')[3],
        feedName: $(this).val()
      };
      console.log(data);
      return $.ajax({
        type: 'POST',
        data: data,
        url: '/listen/edit/' + data.feedID,
        success: function(data) {
          $('.hark-container').html(data);
          return window.ajaxHelpers();
        }
      });
    }
  });

  $(document).delegate('.sidebar-action-remove', 'click', function(e) {
    var data;
    e.preventDefault();
    data = {
      feedID: $(e.currentTarget).attr('href').split('/')[3]
    };
    return $.ajax({
      type: 'POST',
      data: data,
      url: '/listen/remove/' + data.feedID,
      success: function(data) {
        console.log(data);
        $('.hark-container').html(data);
        return window.ajaxHelpers();
      }
    });
  });

  $(document).delegate('.podcast-item:not(.selected)', 'click', function(e) {
    $('.podcast-item').removeClass('selected');
    $(e.currentTarget).addClass('selected');
    return $('.act-listen, .act-mark, .act-read, .act-source, .act-download').removeClass('inactive').addClass('active');
  });

  $(document).delegate('.selected', 'click', function(e) {
    $(e.currentTarget).removeClass('selected');
    return $('.act-listen, .act-mark, .act-read, .act-source, .act-download').removeClass('active').addClass('inactive');
  });

  $(document).delegate('.item-actions-listen', 'click', function(e) {
    return console.log('hi');
  });

  $(document).delegate('.act-read.active', 'click', function(e) {
    $('.selected').children('.podcastDescription').toggle(500);
    return false;
  });

  $(document).delegate('.item-actions-read', 'click', function(e) {
    console.log('hi');
    return $(e.currentTarget).parent().parent().children('.podcastDescription').toggle(500);
  });

  $(document).delegate('.act-source.active', 'click', function(e) {
    return window.open($('.selected').attr('data-source'), '_newtab');
  });

  $(document).delegate('.act-download.active', 'click', function(e) {
    return window.open($('.selected').attr('data-file'), '_newtab');
  });

  $(document).delegate('.act-sorting', 'click', function(e) {
    return $('.act-sorting ul').toggle();
  });

  $(document).delegate('.sort-feed', 'click', function(e) {
    var feedSortMe;
    feedSortMe = [];
    $('.podcast-item').each(function(e) {
      var sortData;
      sortData = {
        uuid: $(this).attr('data-uuid'),
        feedTitle: $(this).attr('data-feed')
      };
      return feedSortMe.push(sortData);
    });
    if ($('.sort-feed').hasClass('descending') === !true) {
      feedSortMe.sort(function(a, b) {
        if (a['feedTitle'].toLowerCase() > b['feedTitle'].toLowerCase()) {
          return 1;
        } else if (a['feedTitle'].toLowerCase() < b['feedTitle'].toLowerCase()) {
          return -1;
        }
        return 0;
      });
      $('.sort-feed').addClass('descending');
      $('.sort-title i, .sort-date i').removeClass('icon-chevron-down icon-chevron-up');
      $('.sort-feed i').removeClass('icon-chevron-up').addClass('icon-chevron-down');
    } else {
      feedSortMe.sort(function(a, b) {
        if (a['feedTitle'].toLowerCase() < b['feedTitle'].toLowerCase()) {
          return 1;
        } else if (a['feedTitle'].toLowerCase() > b['feedTitle'].toLowerCase()) {
          return -1;
        }
        return 0;
      });
      $('.sort-feed').removeClass('descending').addClass('ascending');
      $('.sort-title i, .sort-date i').removeClass('icon-chevron-down icon-chevron-up');
      $('.sort-feed i').removeClass('icon-chevron-down').addClass('icon-chevron-up');
    }
    return $.each(feedSortMe, function() {
      return $('.podcastList').append($('[data-uuid="' + this.uuid + '"]'));
    });
  });

  $(document).delegate('.sort-title', 'click', function(e) {
    var feedSortMe;
    feedSortMe = [];
    $('.podcast-item').each(function(e) {
      var sortData;
      sortData = {
        uuid: $(this).attr('data-uuid'),
        podcastTitle: $(this).attr('data-title')
      };
      return feedSortMe.push(sortData);
    });
    if ($('.sort-title').hasClass('descending') === !true) {
      feedSortMe.sort(function(a, b) {
        if (a['podcastTitle'].toLowerCase() > b['podcastTitle'].toLowerCase()) {
          return 1;
        } else if (a['podcastTitle'].toLowerCase() < b['podcastTitle'].toLowerCase()) {
          return -1;
        }
        return 0;
      });
      $('.sort-title').addClass('descending');
      $('.sort-feed i, .sort-date i').removeClass('icon-chevron-down icon-chevron-up');
      $('.sort-title i').removeClass('icon-chevron-up').addClass('icon-chevron-down');
    } else {
      feedSortMe.sort(function(a, b) {
        if (a['podcastTitle'].toLowerCase() < b['podcastTitle'].toLowerCase()) {
          return 1;
        } else if (a['podcastTitle'].toLowerCase() > b['podcastTitle'].toLowerCase()) {
          return -1;
        }
        return 0;
      });
      $('.sort-title').removeClass('descending').addClass('ascending');
      $('.sort-feed i, .sort-date i').removeClass('icon-chevron-down icon-chevron-up');
      $('.sort-title i').removeClass('icon-chevron-down').addClass('icon-chevron-up');
    }
    return $.each(feedSortMe, function() {
      return $('.podcastList').append($('[data-uuid="' + this.uuid + '"]'));
    });
  });

  $(document).delegate('.sort-date', 'click', function(e) {
    var feedSortMe;
    feedSortMe = [];
    $('.podcast-item').each(function(e) {
      var sortData;
      sortData = {
        uuid: $(this).attr('data-uuid'),
        date: $(this).children('.podcast-feed').children('.moment').attr('data-date')
      };
      return feedSortMe.push(sortData);
    });
    if ($('.sort-date').hasClass('descending') === !true) {
      feedSortMe.sort(function(a, b) {
        if (moment(a['date']) < moment(b['date'])) {
          return 1;
        }
        if (moment(a['date']) > moment(b['date'])) {
          return -1;
        }
        return 0;
      });
      $('.sort-date').addClass('descending');
      $('.sort-title i, .sort-feed i').removeClass('icon-chevron-down icon-chevron-up');
      $('.sort-date i').removeClass('icon-chevron-up').addClass('icon-chevron-down');
    } else {
      feedSortMe.sort(function(a, b) {
        if (moment(a['date']) > moment(b['date'])) {
          return 1;
        }
        if (moment(a['date']) < moment(b['date'])) {
          return -1;
        }
        return 0;
      });
      $('.sort-date').removeClass('descending').addClass('ascending');
      $('.sort-title i, .sort-feed i').removeClass('icon-chevron-down icon-chevron-up');
      $('.sort-date i').removeClass('icon-chevron-down').addClass('icon-chevron-up');
    }
    console.log(feedSortMe);
    return $.each(feedSortMe, function() {
      return $('.podcastList').append($('[data-uuid="' + this.uuid + '"]'));
    });
  });

}).call(this);

(function() {
  var $, History, State, dir_pagination, listenHeight, momentize, path, progress, sidebarHeight, siteUrl;

  $ = jQuery;

  History = State = progress = path = dir_pagination = null;

  $(document).ready(function() {
    window.ajaxHelpers();
    State = History.getState();
    window.dir_pagination();
  });

  window.onload = function() {
    return window.jplayer();
  };

  window.onresize = function(event) {
    sidebarHeight();
    return listenHeight();
  };

  window.ajaxHelpers = function() {
    sidebarHeight();
    listenHeight();
    momentize();
    return $('#loading').fadeOut(300);
  };

  History = window.History;

  siteUrl = "http://" + top.location.host.toString();

  $(document).delegate('a:not(.history-ignore)[href="/listen"], \
             a[href="/directory"],\
             a[href="/settings"],\
             a[href="/help"],\
             a[href^="/listen/podcast/"],\
             a[href^="/directory/category/"]', "click", function(e) {
    e.preventDefault();
    State = History.getState();
    path = $(e.currentTarget).text();
    return History.pushState({}, "", $(e.currentTarget).attr('href'));
  });

  History.Adapter.bind(window, 'statechange', function() {
    $('#loading').fadeIn(300);
    State = History.getState();
    History.log(State.data, State.title, State.url, State.hash);
    if (State.hash === '/listen' || State.hash === '/listen/') {
      return $.ajax({
        type: 'POST',
        url: '/listen',
        success: function(data) {
          $('.hark-container').replaceWith(data);
          document.title = 'Hark | Your podcasts';
          return window.ajaxHelpers();
        }
      });
    } else if (State.hash === '/directory' || State.hash === '/directory/') {
      return $.ajax({
        type: 'POST',
        url: '/directory',
        success: function(data) {
          $('.hark-container').html(data);
          window.dir_pagination();
          document.title = 'Hark | The Directory';
          return window.ajaxHelpers();
        }
      });
    } else if (State.hash === '/settings' || State.hash === '/settings/') {
      return $.ajax({
        type: 'POST',
        url: '/settings',
        success: function(data) {
          $('.hark-container').html(data);
          document.title = 'Hark | Your settings';
          return window.ajaxHelpers();
        }
      });
    } else if (State.hash === '/help' || State.hash === '/help/') {
      return $.ajax({
        type: 'POST',
        url: '/help',
        success: function(data) {
          $('.hark-container').html(data);
          document.title = 'Hark | FAQ & Help';
          return window.ajaxHelpers();
        }
      });
    } else if (State.hash.indexOf('/listen/podcast/') !== -1) {
      return $.ajax({
        type: 'POST',
        data: {
          feedID: State.hash.split('/')[3]
        },
        url: State.hash,
        success: function(data) {
          $('.primary').html(data);
          document.title = 'Hark | ' + $(data).find('.podcast-item:first-of-type').attr('data-feed');
          return window.ajaxHelpers();
        }
      });
    } else if (State.hash.indexOf('/directory/category/') !== -1) {
      return $.ajax({
        type: 'POST',
        data: {
          feedID: State.hash.split('/')[3]
        },
        url: State.hash,
        success: function(data) {
          $('.primary').html(data);
          window.dir_pagination();
          return window.ajaxHelpers();
        }
      });
    } else {

    }
  });

  $(document).delegate('.current-item, .current-feed', 'click', function(e) {
    var data;
    e.preventDefault();
    if ($(e.currentTarget).is('.blank')) {
      console.log('blank');
    } else {
      data = {
        feedID: $(this).attr('href').split('/')[3]
      };
      return $.ajax({
        type: 'POST',
        data: data,
        url: '/listen/podcast/' + data.feedID,
        success: function(data) {
          $('.primary').html(data);
          return window.ajaxHelpers();
        }
      });
    }
  });

  sidebarHeight = function() {
    var c_height, c_width, sidebar;
    c_width = $(window).width();
    c_height = $(window).height();
    sidebar = $('.sidebar');
    return $('.sidebar').css('height', c_height - 171);
  };

  listenHeight = function() {
    var c_height, c_width, listen;
    c_width = $(window).width();
    c_height = $(window).height();
    listen = $('.primary');
    return $('.primary').css('height', c_height - 171);
  };

  $('.modal-close').live('click', function(e) {
    return $('#modal').fadeOut(200);
  });

  $(document).delegate('.categories li:not(.safe), .subscriptions li:not(.safe), .currently-playing li:not(.heading), .choose-settings li:not(.safe), .questions li:not(.safe)', 'hover', function(e) {
    if (e.type === 'mouseenter') {
      return $('.hover-er').css('top', $(e.currentTarget).offset().top + 0).css('opacity', '100').css('height', $(e.currentTarget).height());
    } else {
      if ($(e.currentTarget).children('.sidebar-expander').is('.expanded')) {

      } else {
        return $('.hover-er').css('opacity', '0');
      }
    }
  });

  momentize = function() {
    return $('.moment').each(function(i) {
      $(this).attr('data-date', $(this).text());
      return $(this).text(moment($(this).text()).fromNow());
    });
  };

}).call(this);

(function() {
  var wookmark;

  wookmark = function() {};

  $(document).delegate('.directory-feed-subscribe', 'click', function(e) {
    e.preventDefault();
    return $.ajax({
      type: 'POST',
      url: $(e.currentTarget).attr('href'),
      error: function(err) {
        $('#modal').html($(err.responseText));
        return $('#modal').fadeIn(500);
      },
      success: function(data, textStatus, jqXHR) {
        return $(e.currentTarget).text('Subscribed!');
      }
    });
  });

  $(document).delegate('.category a:not(.loadAll)', 'click', function(e) {
    e.preventDefault();
    return $.ajax({
      type: 'POST',
      url: $(this).attr('href'),
      data: $(this).attr('href'),
      success: function(data) {
        $('.primary').html(data);
        console.log(data);
        ajaxHelpers();
        return window.dir_pagination();
      }
    });
  }).delegate('.category a.loadAll', 'click', function(e) {
    e.preventDefault();
    return $.ajax({
      type: 'POST',
      url: $(this).attr('href'),
      data: $(this).attr('href'),
      success: function(data) {
        $('.hark-container').html(data);
        ajaxHelpers();
        return window.dir_pagination();
      }
    });
  });

  $(document).on('click', '.directory-sort-popularity', function(e) {
    if ($(this).is('.desc')) {
      $('.directory-item').tsort({
        attr: 'data-subs'
      });
      return $('.directory-sort-popularity').removeClass('desc').addClass('asc');
    } else {
      $('.directory-item').tsort({
        order: 'desc',
        attr: 'data-subs'
      });
      return $('.directory-sort-popularity').removeClass('asc').addClass('desc');
    }
  });

  $(document).on('click', '.directory-sort-alphabetical', function(e) {
    if ($(this).is('.desc')) {
      $('.directory-item').tsort($(this).children('h1').text(), {
        order: 'desc'
      });
      return $('.directory-sort-alphabetical').removeClass('desc').addClass('asc');
    } else {
      $('.directory-item').tsort($(this).children('h1').text(), {
        order: 'asc'
      });
      return $('.directory-sort-alphabetical').removeClass('asc').addClass('desc');
    }
  });

  $(document).on('click', '.directory-sort-latest', function(e) {
    if ($(this).is('.desc')) {
      $('.directory-item').tsort({
        attr: 'data-date'
      });
      return $('.directory-sort-latest').removeClass('desc').addClass('asc');
    } else {
      $('.directory-item').tsort({
        order: 'desc',
        attr: 'data-date'
      });
      return $('.directory-sort-latest').removeClass('asc').addClass('desc');
    }
  });

  $(document).on('click', '.directory-sort-pure-alpha', function(e) {
    var category;
    e.preventDefault();
    category = null;
    if (typeof (top.location.pathname.split('/')[3]) !== 'undefined') {
      category = top.location.pathname.split('/')[3];
    }
    return $.ajax({
      type: 'POST',
      url: '/directory/sort-title',
      data: {
        category: category
      },
      success: function(data) {
        $('.hark-container').html(data);
        return ajaxHelpers();
      }
    });
  });

  window.dir_pagination = function() {
    var current_page, next_page, prev_page;
    current_page = parseInt($('.directory-main').attr('data-page'));
    if (current_page === 1) {
      $('.pagination-next').attr('href', '/directory/page/2');
      return $('.pagination-prev').css({
        'opacity': 0
      });
    } else {
      prev_page = current_page - 1;
      next_page = current_page + 1;
      $('.pagination-prev').attr('href', '/directory/page/' + prev_page);
      return $('.pagination-next').attr('href', '/directory/page/' + next_page);
    }
  };

  $(document).on('click', '.pagination-prev', function(e) {
    var category;
    e.preventDefault();
    category = null;
    if (typeof (top.location.pathname.split('/')[3]) !== 'undefined') {
      category = top.location.pathname.split('/')[3];
    }
    return $.ajax({
      type: 'POST',
      url: $(this).attr('href'),
      data: {
        category: category
      },
      success: function(data) {
        $('.hark-container').html(data);
        ajaxHelpers();
        return window.dir_pagination();
      }
    });
  });

  $(document).on('click', '.pagination-next', function(e) {
    var category;
    e.preventDefault();
    category = null;
    if (typeof (top.location.pathname.split('/')[3]) !== 'undefined') {
      category = top.location.pathname.split('/')[3];
    }
    return $.ajax({
      type: 'POST',
      url: $(this).attr('href'),
      data: {
        category: category
      },
      success: function(data) {
        $('.hark-container').html(data);
        ajaxHelpers();
        return window.dir_pagination();
      }
    });
  });

}).call(this);

(function() {

  window.jplayer = function() {
    $(document).delegate('.video-move', 'mousedown', function(e) {
      return $(window).bind('mousemove', function(e) {
        $('.video-player').removeClass('minimized');
        return $('.video-player').css({
          'top': e.clientY - 20,
          'left': e.clientX + 250,
          'margin-left': ''
        });
      });
    }).delegate('.video-move', 'mouseup', function(e) {
      $('.video-move').undelegate();
      return $(window).unbind('mousemove');
    });
    $('body').on('click', '.video-minimize', function(e) {
      var half_width, pos;
      if ($('.video-player').is('.minimized')) {
        $('.video-player').removeClass('minimized');
        half_width = $('.video-player').width() / 2;
        pos = $(window).width() - half_width;
        return $('.video-player').css({
          'bottom': 100 + 'px',
          'left': '50%',
          'margin-left': -half_width + 'px'
        });
      } else {
        $('.video-player').addClass('minimized');
        pos = $(window).width() - $('.video-player').width() / 2;
        return $('.video-player').css({
          'bottom': -180 + 'px',
          'left': pos,
          'top': '',
          'margin-left': ''
        });
      }
    });
    return $(document).on('click', '.video-resize', function(e) {
      return console.log('rstarstarstarsstarstarstsatrstarststarstarstttstastrsttstsst');
    });
  };

}).call(this);