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

JumpToTag.KeyConfig = {
    keyTagPair: [
        {
            key: KE.DOM_VK_P,
            tag: "p"
        },
        {
            key: KE.DOM_VK_H,
            tag: "h1, h2, h3, h4, h5, h6"
        },
        {
            key: KE.DOM_VK_A,
            tag: "a"
        },
        {
            key: KE.DOM_VK_L,
            tag: "li"
        },
        {
            key: KE.DOM_VK_B,
            tag: "b"
        },
        {
            key: KE.DOM_VK_I,
            tag: "img"
        }
    ]
};