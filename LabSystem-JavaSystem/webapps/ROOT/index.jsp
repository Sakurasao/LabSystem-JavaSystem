<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lab System</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
    <script>
      (function() {
        try {
          if (typeof window !== "undefined") {
            var originalFetch = window.fetch;
            var customFetch = originalFetch;

            var globalThisProxy = new Proxy(window, {
              get: function(target, prop) {
                if (prop === 'fetch') {
                  return customFetch;
                }
                var val = target[prop];
                if (typeof val === 'function') {
                  var boundFn = function() {
                    if (new.target) {
                      return Reflect.construct(val, arguments);
                    }
                    return val.apply(target, arguments);
                  };
                  if (val.prototype) boundFn.prototype = val.prototype;
                  Object.defineProperty(boundFn, 'name', { value: val.name, configurable: true });
                  return boundFn;
                }
                return val;
              },
              set: function(target, prop, value) {
                if (prop === 'fetch') {
                  customFetch = value;
                  return true;
                }
                target[prop] = value;
                return true;
              },
              has: function(target, prop) {
                return prop === 'fetch' || prop in target;
              }
            });

            try {
              Object.defineProperty(window, 'globalThis', {
                value: globalThisProxy,
                writable: true,
                configurable: true,
                enumerable: true
              });
            } catch (e) {
              console.warn("Could not define globalThis on window", e);
            }

            try {
              Object.defineProperty(window, 'self', {
                value: globalThisProxy,
                writable: true,
                configurable: true,
                enumerable: true
              });
            } catch (e) {
              console.warn("Could not define self on window", e);
            }

            try {
              Object.defineProperty(window, 'window', {
                value: globalThisProxy,
                writable: true,
                configurable: true,
                enumerable: true
              });
            } catch (e) {
              console.warn("Could not define window on window", e);
            }

            try {
              Object.defineProperty(window, 'global', {
                value: globalThisProxy,
                writable: true,
                configurable: true,
                enumerable: true
              });
            } catch (e) {}
          }
        } catch (e) {
          console.warn("Global proxy patch failed", e);
        }
      })();
    </script>
    <script type="module" crossorigin src="/assets/index-B8mj9QXW.js?v=2"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-DteBZLMl.css?v=2">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>

