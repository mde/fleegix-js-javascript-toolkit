
/*
 * Copyright 2006 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *         http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Version 1.0
*/
if (typeof fleegix == 'undefined') { var fleegix = {}; }
fleegix.event = new function() {
    
    // List of channels being published to
    var channels = {};
    
    this.subscribe = function(subscr, obj, method) {
        // Make sure there's an obj param
        if (!obj) { return };
        // Create the channel if it doesn't exist
        if (!channels[subscr]) {
            channels[subscr] = {};
            channels[subscr].audience = [];
        }
        else {
            // Remove any previous listener method for the obj
            this.unsubscribe(subscr, obj);
        }
        // Add the object and its handler to the array
        // for the channel
        channels[subscr].audience.push([obj, method]);
    };
    this.unsubscribe = function(unsubscr, obj) {
        // If not listener obj specified, kill the
        // entire channel
        if (!obj) {
            channels[unsubscr] = null;
        }
        // Otherwise remove the object and its handler
        // from the array for the channel
        else {
            if (channels[unsubscr]) {
                var aud = channels[unsubscr].audience;
                for (var i = 0; i < aud.length; i++) {
                    if (aud[i][0] == obj) {
                       aud.splice(i, 1); 
                    }
                }
            }
        }
    };
    this.publish = function(pub, data) {
        // Make sure the channel exists
        if (channels[pub]) {
            aud = channels[pub].audience;
            // Pass the published data to all the 
            // obj/methods listening to the channel
            for (var i = 0; i < aud.length; i++) {
                var listenerObject = aud[i][0];
                var handlerMethod = aud[i][1];
                listenerObject[handlerMethod](data);
            }
        }
    };
}
fleegix.event.constructor = null;

