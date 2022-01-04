// ignore_for_file: avoid_print

/*
 * @Author: hsycc
 * @Date: 2021-09-13 02:06:53
 * @LastEditTime: 2022-01-04 16:34:20
 * @Description: js_sdk.dart
 * 
 */
import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
// import 'package:poly/common/oss.dart';

class ClientResponse {
  int code;
  dynamic data;
  String? message;
  ClientResponse(this.code, this.data, this.message);

  Map toJson() => {'code': code, 'data': data, 'message': message};

  static ClientResponse fromJson(Map<String, dynamic> map) {
    ClientResponse model =
        ClientResponse(map['code'], map['data'], map['message']);
    return model;
  }
}

// 约定JavaScript调用方法时的统一模板
class BridgeModel {
  String method; // 方法名
  Map<String, dynamic> payload; // 参数
  String? callbackId; // 回调名

  BridgeModel(this.method, this.payload, this.callbackId);

  // jsonEncode方法中会调用实体类的这个方法。如果实体类中没有这个方法，会报错。
  Map toJson() {
    Map map = {};
    map['method'] = method;
    map['payload'] = payload;
    map['callbackId'] = callbackId;
    return map;
  }

  // jsonDecode(jsonStr)方法返回的是Map<String, dynamic>类型，需要这里将map转换成实体类
  static BridgeModel fromJson(Map<String, dynamic> map) {
    BridgeModel model = BridgeModel(map['method'], map['payload'], map['callbackId']);
    return model;
  }

  @override
  String toString() {
    return 'BridgeModel: {method: $method, payload: $payload, callbackId: $callbackId}';
  }
}

class JsbridgeSDK {
  // sdk 调用白名单
  static List<String> whiteList = ['127.0.0.1:8080'];

  late WebViewController webController;

  // 格式化参数   {"method":"***","payload":{...},"callbackId":"*"}
  static BridgeModel parseJson(String jsonStr) {
    try {
      return BridgeModel.fromJson(jsonDecode(jsonStr));
    } catch (e) {
      throw Exception('序列化参数失败 $e');
    }
  }

  static bool isInWhiteList(String url) {
    if (whiteList.contains('*')) {
      return true;
    } else {
      try {
        return whiteList.firstWhere((el) => url.contains(el)).isNotEmpty;
      } catch (e) {
        return false;
      }
    }
  }

  /// 向H5暴露接口调用
  static void executeMethod(BuildContext context,
      WebViewController webController, String message) async {
    print(message);

    // webController = webCtrl;

    var model = parseJson(message);

    var handlers = resgiterHandler(context, model);

    // 运行method对应方法实现
    var method = model.method;

    dynamic result;

    // 不在sdk调用的白名单 throw
    var currentUrl = await webController.currentUrl();
    if (!isInWhiteList(currentUrl!)) {
      result = handlers['unAuthorized']();
      // throw Exception('fail unAuthorized in jssdk:  url $currentUrl');
    } else {
      if (method == 'getResgiterList') {
        result = getResgiterList(handlers);
      } else if (handlers.containsKey(method)) {
        try {
          print('sdk 调用 [$method]');
          result = handlers[method]();
        } catch (e) {
          throw Exception('sdk 调用 [$method] error: $e');
        }
      } else {
        result = handlers['unResgiter']();
      }
    }

    // 统一处理JS注册的回调函数
    var callbackId = model.callbackId;

    if (callbackId != null) {
      void runCallBack(res) {
        // 执行js
        webevaluateJavascript(webController, callbackId, res);
      }

      if (result is Future) {
        result.then((value) {
          print('sdk 调用 [$method] successful.');
          runCallBack(value);
        });
      } else {
        runCallBack(result);
      }
    } else {
      print('sdk 调用 [$method], 无需cabllback');
    }
  }

  static webevaluateJavascript(
      WebViewController webController, callbackId, res) async {
    var resultStr = jsonEncode(res ?? '');
    print('cabllbackId: $callbackId, result: $resultStr');
    await webController
        .runJavascriptReturningResult("window.PolyJsbridge.$callbackId($resultStr);");
    // print(
    //     'return webController.evaluateJavascript  $callbackId return result: $val');
  }

  // 所有经过sdk处理的功能需要在这里注册一下
  static resgiterHandler(
    BuildContext context,
    BridgeModel model,
  ) {
    return {
      'toast': () {
        return toast(context, model);
      },
      'log': () {
        return log(context, model);
      },
      'navigatorTo': () {
        return navigatorTo(context, model);
      },
      'redirectTo': () {
        return redirectTo(context, model);
      },
      'navigatorBack': () {
        return navigatorBack(context, model);
      },
      'exitApp': () {
        return exitApp(context, model);
      },
      'unResgiter': () {
        return unResgiter(context, model);
      },
      'unAuthorized': () {
        return unAuthorized(context, model);
      },
    };
  }

  /// add adk api  in this*/

  /* 底部toast */
  static toast(BuildContext context, BridgeModel model) {
    String msg = model.payload['message'] ?? '';
    // 显示底部 toast
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        duration: const Duration(seconds: 2),
      ),
    );
    return ClientResponse(200, null, 'ok').toJson();
  }

  /* log */
  static log(BuildContext context, BridgeModel model) {
    var msg = model.payload['message'] ?? '';
    print('''
    
      web-log ================================ 
        $msg
      ========================================
      ''');
    return ClientResponse(200, null, 'ok').toJson();
  }

  /* app 页面 跳转  */
  static void navigatorTo(BuildContext context, BridgeModel model) {
    String url = model.payload['url'] ?? '';
    Navigator.of(context).pushNamed(url, arguments: '');
  }

  /* 回退到app上个路由 */
  static void navigatorBack(BuildContext context, BridgeModel model) {
    Navigator.of(context).pop();
  }

  static void redirectTo(BuildContext context, BridgeModel model) {
    String url = model.payload['url'] ?? '';
    // pushReplacementNamed 基本等价于 popAndPushNamed
    Navigator.of(context).pushReplacementNamed(url, arguments: '');
  }

  /* 退出app */
  static void exitApp(BuildContext context, BridgeModel model) {
    exit(0);
  }

  /* polySdk 未注册该方法 */
  static unResgiter(BuildContext context, BridgeModel model) {
    return ClientResponse(403, null,
            "PolySdk didn't resgiter method by name of ${model.method};")
        .toJson();
  }

  /* 鉴权不过 */
  static unAuthorized(BuildContext context, BridgeModel model) {
    return ClientResponse(401, null, 'PolySdk unAuthorized').toJson();
  }

  /* 获取已经注册的 api list */
  static getResgiterList(handlers) {
    List list = [];
    handlers.forEach((k, v) {
      if (k != 'unResgiter' && k != 'unAuthorized') {
        list.add(k);
      }
      return;
    });
    return ClientResponse(200, list, 'ok').toJson();
  }
  /// add api */
}
