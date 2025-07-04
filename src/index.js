#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var zod_1 = require("zod");
var playwright_1 = require("playwright");
// Server configuration
var server = new mcp_js_1.McpServer({
    name: "playwright-automation",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
// Global browser management
var currentBrowser = null;
var currentContext = null;
var currentPage = null;
// Helper function to ensure browser is launched
function ensureBrowser() {
    return __awaiter(this, arguments, void 0, function (browserType) {
        var _a, error_1;
        if (browserType === void 0) { browserType = "chromium"; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (currentBrowser && currentBrowser.isConnected()) {
                        return [2 /*return*/, currentBrowser];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, , 10]);
                    _a = browserType;
                    switch (_a) {
                        case "firefox": return [3 /*break*/, 2];
                        case "webkit": return [3 /*break*/, 4];
                    }
                    return [3 /*break*/, 6];
                case 2: return [4 /*yield*/, playwright_1.firefox.launch({ headless: false })];
                case 3:
                    currentBrowser = _b.sent();
                    return [3 /*break*/, 8];
                case 4: return [4 /*yield*/, playwright_1.webkit.launch({ headless: false })];
                case 5:
                    currentBrowser = _b.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, playwright_1.chromium.launch({ headless: false })];
                case 7:
                    currentBrowser = _b.sent();
                    _b.label = 8;
                case 8:
                    console.error("Launched ".concat(browserType, " browser"));
                    return [2 /*return*/, currentBrowser];
                case 9:
                    error_1 = _b.sent();
                    throw new Error("Failed to launch ".concat(browserType, " browser: ").concat(error_1));
                case 10: return [2 /*return*/];
            }
        });
    });
}
// Helper function to ensure page is available
function ensurePage() {
    return __awaiter(this, void 0, void 0, function () {
        var browser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (currentPage && !currentPage.isClosed()) {
                        return [2 /*return*/, currentPage];
                    }
                    return [4 /*yield*/, ensureBrowser()];
                case 1:
                    browser = _a.sent();
                    if (!!currentContext) return [3 /*break*/, 3];
                    return [4 /*yield*/, browser.newContext()];
                case 2:
                    currentContext = _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, currentContext.newPage()];
                case 4:
                    currentPage = _a.sent();
                    console.error("Created new page");
                    return [2 /*return*/, currentPage];
            }
        });
    });
}
// Cleanup function
function cleanup() {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    if (!(currentPage && !currentPage.isClosed())) return [3 /*break*/, 2];
                    return [4 /*yield*/, currentPage.close()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!currentContext) return [3 /*break*/, 4];
                    return [4 /*yield*/, currentContext.close()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    if (!(currentBrowser && currentBrowser.isConnected())) return [3 /*break*/, 6];
                    return [4 /*yield*/, currentBrowser.close()];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    console.error("Error during cleanup:", error_2);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Register browser management tools
server.tool("launch-browser", "Launch a browser instance", {
    browserType: zod_1.z.enum(["chromium", "firefox", "webkit"]).optional().describe("Browser type to launch"),
    headless: zod_1.z.boolean().optional().describe("Run browser in headless mode"),
}, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var browser, _c, error_3;
    var _d = _b.browserType, browserType = _d === void 0 ? "chromium" : _d, _e = _b.headless, headless = _e === void 0 ? false : _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 11, , 12]);
                // Close existing browser if any
                return [4 /*yield*/, cleanup()];
            case 1:
                // Close existing browser if any
                _f.sent();
                browser = void 0;
                _c = browserType;
                switch (_c) {
                    case "firefox": return [3 /*break*/, 2];
                    case "webkit": return [3 /*break*/, 4];
                }
                return [3 /*break*/, 6];
            case 2: return [4 /*yield*/, playwright_1.firefox.launch({ headless: headless })];
            case 3:
                browser = _f.sent();
                return [3 /*break*/, 8];
            case 4: return [4 /*yield*/, playwright_1.webkit.launch({ headless: headless })];
            case 5:
                browser = _f.sent();
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, playwright_1.chromium.launch({ headless: headless })];
            case 7:
                browser = _f.sent();
                _f.label = 8;
            case 8:
                currentBrowser = browser;
                return [4 /*yield*/, browser.newContext()];
            case 9:
                currentContext = _f.sent();
                return [4 /*yield*/, currentContext.newPage()];
            case 10:
                currentPage = _f.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Successfully launched ".concat(browserType, " browser (headless: ").concat(headless, ")"),
                            },
                        ],
                    }];
            case 11:
                error_3 = _f.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Failed to launch browser: ".concat(error_3),
                            },
                        ],
                    }];
            case 12: return [2 /*return*/];
        }
    });
}); });
server.tool("navigate-to", "Navigate to a URL", {
    url: zod_1.z.string().url().describe("The URL to navigate to"),
    waitUntil: zod_1.z.enum(["load", "domcontentloaded", "networkidle"]).optional().describe("When to consider navigation finished"),
}, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var page, title, currentUrl, error_4;
    var url = _b.url, _c = _b.waitUntil, waitUntil = _c === void 0 ? "load" : _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 4, , 5]);
                return [4 /*yield*/, ensurePage()];
            case 1:
                page = _d.sent();
                return [4 /*yield*/, page.goto(url, { waitUntil: waitUntil })];
            case 2:
                _d.sent();
                return [4 /*yield*/, page.title()];
            case 3:
                title = _d.sent();
                currentUrl = page.url();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Successfully navigated to: ".concat(currentUrl, "\nPage title: ").concat(title),
                            },
                        ],
                    }];
            case 4:
                error_4 = _d.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Failed to navigate to ".concat(url, ": ").concat(error_4),
                            },
                        ],
                    }];
            case 5: return [2 /*return*/];
        }
    });
}); });
server.tool("take-screenshot", "Take a screenshot of the current page", {
    path: zod_1.z.string().optional().describe("Path to save the screenshot"),
    fullPage: zod_1.z.boolean().optional().describe("Capture full page"),
}, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var page, screenshot, error_5;
    var path = _b.path, _c = _b.fullPage, fullPage = _c === void 0 ? false : _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                return [4 /*yield*/, ensurePage()];
            case 1:
                page = _d.sent();
                return [4 /*yield*/, page.screenshot({
                        path: path,
                        fullPage: fullPage,
                        type: 'png'
                    })];
            case 2:
                screenshot = _d.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: path
                                    ? "Screenshot saved to: ".concat(path)
                                    : "Screenshot captured (buffer returned)",
                            },
                        ],
                    }];
            case 3:
                error_5 = _d.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Failed to take screenshot: ".concat(error_5),
                            },
                        ],
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); });
server.tool("click-element", "Click on an element by selector", {
    selector: zod_1.z.string().describe("CSS selector or text to find the element"),
    timeout: zod_1.z.number().optional().describe("Timeout in milliseconds"),
}, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var page, error_6;
    var selector = _b.selector, _c = _b.timeout, timeout = _c === void 0 ? 30000 : _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                return [4 /*yield*/, ensurePage()];
            case 1:
                page = _d.sent();
                return [4 /*yield*/, page.click(selector, { timeout: timeout })];
            case 2:
                _d.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Successfully clicked element: ".concat(selector),
                            },
                        ],
                    }];
            case 3:
                error_6 = _d.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Failed to click element ".concat(selector, ": ").concat(error_6),
                            },
                        ],
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); });
server.tool("fill-input", "Fill an input field with text", {
    selector: zod_1.z.string().describe("CSS selector for the input field"),
    text: zod_1.z.string().describe("Text to fill in the input"),
    timeout: zod_1.z.number().optional().describe("Timeout in milliseconds"),
}, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var page, error_7;
    var selector = _b.selector, text = _b.text, _c = _b.timeout, timeout = _c === void 0 ? 30000 : _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                return [4 /*yield*/, ensurePage()];
            case 1:
                page = _d.sent();
                return [4 /*yield*/, page.fill(selector, text, { timeout: timeout })];
            case 2:
                _d.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Successfully filled input ".concat(selector, " with: ").concat(text),
                            },
                        ],
                    }];
            case 3:
                error_7 = _d.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Failed to fill input ".concat(selector, ": ").concat(error_7),
                            },
                        ],
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); });
server.tool("get-text", "Get text content from an element", {
    selector: zod_1.z.string().describe("CSS selector for the element"),
    timeout: zod_1.z.number().optional().describe("Timeout in milliseconds"),
}, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var page, text, error_8;
    var selector = _b.selector, _c = _b.timeout, timeout = _c === void 0 ? 30000 : _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                return [4 /*yield*/, ensurePage()];
            case 1:
                page = _d.sent();
                return [4 /*yield*/, page.textContent(selector, { timeout: timeout })];
            case 2:
                text = _d.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Text from ".concat(selector, ": ").concat(text || '(no text found)'),
                            },
                        ],
                    }];
            case 3:
                error_8 = _d.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Failed to get text from ".concat(selector, ": ").concat(error_8),
                            },
                        ],
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); });
server.tool("wait-for-element", "Wait for an element to appear", {
    selector: zod_1.z.string().describe("CSS selector for the element to wait for"),
    state: zod_1.z.enum(["attached", "detached", "visible", "hidden"]).optional().describe("State to wait for"),
    timeout: zod_1.z.number().optional().describe("Timeout in milliseconds"),
}, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var page, error_9;
    var selector = _b.selector, _c = _b.state, state = _c === void 0 ? "visible" : _c, _d = _b.timeout, timeout = _d === void 0 ? 30000 : _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 3, , 4]);
                return [4 /*yield*/, ensurePage()];
            case 1:
                page = _e.sent();
                return [4 /*yield*/, page.waitForSelector(selector, { state: state, timeout: timeout })];
            case 2:
                _e.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Element ".concat(selector, " is now ").concat(state),
                            },
                        ],
                    }];
            case 3:
                error_9 = _e.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Failed to wait for element ".concat(selector, ": ").concat(error_9),
                            },
                        ],
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); });
server.tool("evaluate-javascript", "Execute JavaScript code in the browser context", {
    code: zod_1.z.string().describe("JavaScript code to execute"),
}, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var page, result, error_10;
    var code = _b.code;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                return [4 /*yield*/, ensurePage()];
            case 1:
                page = _c.sent();
                return [4 /*yield*/, page.evaluate(code)];
            case 2:
                result = _c.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "JavaScript execution result: ".concat(JSON.stringify(result)),
                            },
                        ],
                    }];
            case 3:
                error_10 = _c.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Failed to execute JavaScript: ".concat(error_10),
                            },
                        ],
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); });
server.tool("close-browser", "Close the current browser instance", {}, function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, cleanup()];
            case 1:
                _a.sent();
                currentBrowser = null;
                currentContext = null;
                currentPage = null;
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Browser closed successfully",
                            },
                        ],
                    }];
            case 2:
                error_11 = _a.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Failed to close browser: ".concat(error_11),
                            },
                        ],
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); });
server.tool("get-page-info", "Get information about the current page", {}, function () { return __awaiter(void 0, void 0, void 0, function () {
    var page, title, url, viewport, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, ensurePage()];
            case 1:
                page = _a.sent();
                return [4 /*yield*/, page.title()];
            case 2:
                title = _a.sent();
                url = page.url();
                viewport = page.viewportSize();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Page Information:\nTitle: ".concat(title, "\nURL: ").concat(url, "\nViewport: ").concat(viewport === null || viewport === void 0 ? void 0 : viewport.width, "x").concat(viewport === null || viewport === void 0 ? void 0 : viewport.height),
                            },
                        ],
                    }];
            case 3:
                error_12 = _a.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Failed to get page info: ".concat(error_12),
                            },
                        ],
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Handle graceful shutdown
process.on('SIGINT', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.error('Received SIGINT, cleaning up...');
                return [4 /*yield*/, cleanup()];
            case 1:
                _a.sent();
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); });
process.on('SIGTERM', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.error('Received SIGTERM, cleaning up...');
                return [4 /*yield*/, cleanup()];
            case 1:
                _a.sent();
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); });
// Start the server
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var transport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transport = new stdio_js_1.StdioServerTransport();
                    return [4 /*yield*/, server.connect(transport)];
                case 1:
                    _a.sent();
                    console.error("Playwright MCP Server running on stdio");
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (error) {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
