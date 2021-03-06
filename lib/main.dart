// ignore_for_file: avoid_print

/*
 * @Author: hsycc
 * @Date: 2021-09-13 02:06:53
 * @LastEditTime: 2022-01-04 16:56:45
 * @Description: 
 * 
 */

import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:jaguar/serve/server.dart';
import 'package:jaguar_flutter_asset/jaguar_flutter_asset.dart';
import 'package:webview_flutter/platform_interface.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'js_bridge_sdk.dart';

void main() async {
  final server = Jaguar(address: '127.0.0.1', port: 8080);
  server.addRoute(serveFlutterAssets());
  await server.serve(logRequests: true);

  server.log.onRecord.listen((r) => print(r));
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Jsbrigde Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const WebViewPage(
        initialUrl: 'http://127.0.0.1:8080/web/index.html?mode=url',
      ),
    );
  }
}

class WebViewPage extends StatefulWidget {
  const WebViewPage({Key? key, required this.initialUrl}) : super(key: key);

  // final String title;

  final String initialUrl;

  @override
  _WebViewPageState createState() => _WebViewPageState();
}

class _WebViewPageState extends State<WebViewPage> {
  final Completer<WebViewController> _controller =
      Completer<WebViewController>();

  late WebViewController _webViewController;

  @override
  void initState() {
    super.initState();

    if (Platform.isAndroid) {
      WebView.platform = SurfaceAndroidWebView();
    }
  }

  @override
  void dispose() async {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Builder(builder: (BuildContext context) {
        return WillPopScope(
          onWillPop: () async {
            return false;
          },
          child: WebView(
            initialUrl: widget.initialUrl,
            javascriptMode: JavascriptMode.unrestricted,
            onWebViewCreated: (WebViewController webViewController) {
              // 2. ??????webserver, ?????? 127.0.0.1 ?????????webserver
              // final String url = await loadFile( "assets/index.html");
              // _webViewController.loadUrl(url);
              _controller.complete(webViewController);

              _controller.future.then((instance) {
                _webViewController = instance;
              });
            },

            // ignore: prefer_collection_literals
            javascriptChannels: <JavascriptChannel>[
              _polyJavascriptChannel(context),
            ].toSet(),
            navigationDelegate: (NavigationRequest request) {
              print('navigationDelegate to $request');
              if (request.url.startsWith('poly://')) {
                print('?????? url scheme  poly//');
                qsParseUrl(request.url);
                return NavigationDecision.prevent; // ????????????
              }
              return NavigationDecision.navigate;
            },
            onPageStarted: (String url) {
              print('Page started loading: $url');
            },
            onPageFinished: (String url) {
              print('Page finished loading: $url');
            },
            gestureNavigationEnabled: false,
            // gestureRecognizers ????????????
            onProgress: (int progress) {
              print("WebView is loading (progress : $progress%)");
            },
            onWebResourceError: (WebResourceError error) {
              print("WebResourceError error  ${error.description}");
            },
            debuggingEnabled: false,

            // userAgent
            initialMediaPlaybackPolicy:
                AutoMediaPlaybackPolicy.require_user_action_for_all_media_types,
            allowsInlineMediaPlayback: false, // ?????? ios ???????????? h5 ??????
            zoomEnabled: false,
            backgroundColor: null,
          ),
        );
      }),
    );
  }

  JavascriptChannel _polyJavascriptChannel(BuildContext context) {
    return JavascriptChannel(
        name: 'PolySdk',
        onMessageReceived: (JavascriptMessage message) {
          String jsonStr = message.message;

          // executeMethod  ???H5??????????????????
          JsbridgeSDK.executeMethod(context, _webViewController, jsonStr);
        });
  }

  void qsParseUrl(String str) {
    str = Uri.decodeComponent(str);
    print(str);
    // ??????  {"method":"toast","payload":{"message":"??????"},"callbackId":"poly_sdk_callback_1632727252090577"})
    str = str.replaceFirst('poly://', '');
    var tmp = str.split('?');
    var tmp1 = tmp[1].split('&');

    Map map;

    if (tmp1.length == 1) {
      map = {
        "method": tmp[0],
        tmp1[0].split('=')[0]: tmp1[0].split('=')[1],
        "callbackId": null
      };
    } else {
      map = {
        "method": tmp[0],
        tmp1[0].split('=')[0]: tmp1[0].split('=')[1],
        tmp1[1].split('=')[0]: tmp1[1].split('=')[1]
      };
    }
    map['payload'] = jsonDecode(map['payload']);
    print(map.toString());
    JsbridgeSDK.executeMethod(context, _webViewController, jsonEncode(map));
  }
}
