/**
 * JumpToTag namespace.
 */
if ("undefined" == typeof(JumpToTag)) {
  var JumpToTag = {};
}

var Cc = Components.classes;
var Ci = Components.interfaces;
var Cr = Components.results;
var Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

var KE = Ci.nsIDOMKeyEvent;

JumpToTag.JumpTag = {
  win: null,
  doc: null,
  
  keys: JumpToTag.KeyConfig.keyTagPair,
  
  timeout: null,
  stopDelay: 5000,
  
  currentState: "Stop",
  currentOffset: {
    top: 0,
    left: 0
  },
  
  init: function() {
    this.win = window.content;
    this.doc = this.win.document;
    this.setSelection(this.doc.getElementsByTagName("body")[0], true);
    this.setOffsetToCurrentSelection();
  },
  
  setSelection: function(element, toStart) {
    var s = this.win.getSelection();
    s.removeAllRanges();
    var range = this.doc.createRange();
    range.selectNode(element);
    range.collapse(toStart);
    s.addRange(range);
  },
  
  setOffsetToCurrentSelection: function() {
    var s = this.win.getSelection();
    var range = s.getRangeAt(0);
    this.currentOffset = this.getOffset(range.startContainer.parentNode);
  },
  
  onmousedown: function(event) {
    var s = this.win.getSelection();
    var range = s.getRangeAt(0);
    this.currentOffset = this.getOffset(range.endContainer.parentNode);
  },
  
  checkFocus: function(event) {
    return event.target == "[object XrayWrapper [object HTMLBodyElement]]";
  },
  
  compareOffset: function(otherOffset) {
    if (this.currentState == "Forward") {
      return otherOffset.top > this.currentOffset.top;
    } else if (this.currentState == "Backward"){
      return otherOffset.top < this.currentOffset.top;
    } else {
      return false; // Error
    }
  },
  
  getOffset: function( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
  },
  
  clearTimeout: function() {
    if (this.timeout != null) {
      clearTimeout(this.timeout);
    }
    this.timeout = null;
  },
  
  stop: function() {
    this.currentOffset = "Stop";
    this.timeout = null;
  },
  
  delayStop: function() {
    this.clearTimeout();
    var _this = this;
    this.timeout = setTimeout(function() { _this.stop() }, this.stopDelay);
  },

  jump: function(event) {
    if (!this.checkFocus(event)) {
      return;
    }

    if (event.keyCode == KE.DOM_VK_CLOSE_BRACKET) {
      if (this.currentState == "Forward") {
        this.currentState = "Stop";
      } else {
        this.currentState = "Forward";
      }
      
      //this.delayStop();
    } else if (event.keyCode == KE.DOM_VK_OPEN_BRACKET) {
      if (this.currentState == "Backward") {
        this.currentState = "Stop";
      } else {
        this.currentState = "Backward";
      }
      
      //this.delayStop();
    } else {
      if (this.currentState != "Stop") {
        //this.clearTimeout();
        
        var keyTag = null;
        for(var i = 0; i < this.keys.length; i++) {
          if (event.keyCode == this.keys[i].key) {
            keyTag = this.keys[i];
            break;
          }
        }
        
        if (keyTag != null) {
          var taglist = this.doc.querySelectorAll(keyTag.tag);
          var minEle = null;
          var minOffset = null;
          var min = Number.MAX_VALUE;
          
          for(var i = 0; i < taglist.length; i++) {
            var eleOffset = this.getOffset(taglist[i]);
            if (this.compareOffset(eleOffset) && Math.abs(eleOffset.top - this.currentOffset.top) < min) {
              minEle = taglist[i];
              minOffset = eleOffset;
              min = Math.abs(eleOffset.top - this.currentOffset.top);
            }
          }
          
          if (minEle != null) {
            this.win.scroll(this.currentOffset.left, minOffset.top);
            this.setSelection(minEle, false);
            this.currentOffset.top = minOffset.top;
          } 
        }
        
        this.currentState = "Stop";
      }
    }
  }
};

window.addEventListener("load", function() {
  gBrowser.addEventListener('DOMContentLoaded', function() {
    JumpToTag.JumpTag.init();
  }, false);
}, false);
window.addEventListener("keydown", function(event) { JumpToTag.JumpTag.jump(event); }, false);
window.addEventListener("mousedown", function(event) { JumpToTag.JumpTag.onmousedown(event); }, false);