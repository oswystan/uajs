/*
 *********************************************************************************
 *                     Copyright (C) 2019 wystan
 *
 *       filename: ua.js
 *    description:
 *        created: 2019-03-23 11:46:20
 *         author: wystan
 *
 *********************************************************************************
 */

class UserAgentDescriptor {
    constructor(name, version, os, osv) {
        this.name    = name;
        this.version = version;
        this.os      = os;
        this.osv     = osv;
    }
    equal(other) {
        return other instanceof UserAgentDescriptor &&
            other.name === this.name && other.version === this.version &&
            other.os === this.os && other.osv === this.osv;
    }
    dup() {
        return new UserAgentDescriptor(this.name, this.version, this.os, this.osv);
    }
}

class UnknownUserAgent extends UserAgentDescriptor {
    constructor() {
        super("unknown", 0, "unknown", "");
    }
}

class WindowsMapper {
    static map(ver) {
        const winmapper = {
            "5.0" : "2000",
            "5.1" : "xp",
            "5.2" : "2003",
            "6.0" : "vista",
            "6.1" : "7",
            "6.2" : "8",
            "6.3" : "8.1",
            "10.0": "10"
        };
        return winmapper[ver] || "";
    }
}

class UserAgentParser {
    constructor() {}
    static parse(ua) {
        let rst = null;
        rst = UserAgentParser.parseIE(ua);
        if (rst) {
            return rst;
        }
        rst = UserAgentParser.parseEdge(ua);
        if (rst) {
            return rst;
        }
        let browser = UserAgentParser.parseBrowser(ua);
        if (!browser) {
            return null;
        }
        let os = UserAgentParser.parseOS(ua);
        if (!os) {
            return null;
        }
        return new UserAgentDescriptor(browser.name, browser.version, os.name, os.version);
    }

    static parseIE(ua) {
        let rst = /MSIE\s(\d+(?:\.\d+));[\s\S]+Windows\sNT\s(\d+(?:\.\d+));/.exec(ua);
        if (rst) {
            return new UserAgentDescriptor("ie", rst[1], "windows", WindowsMapper.map(rst[2]));
        }
        rst = /Windows\sNT\s(\d+(?:\.\d+));[\s\S]+Trident\/\d+.\d+;[\s\S]+rv:(\d+(?:\.\d+))/.exec(ua);
        if (rst) {
            return new UserAgentDescriptor("ie", rst[2], "windows", WindowsMapper.map(rst[1]));
        }
        return null;
    }
    static parseEdge(ua) {
        let rst = /Windows\sNT\s(\d+(?:\.\d+)+);[\s\S]+Edge\/(\d+(?:\.\d+))$/.exec(ua);
        if (rst) {
            return new UserAgentDescriptor("edge", rst[2], "windows", WindowsMapper.map(rst[1]));
        }
        return null;
    }

    static parseOS(ua) {
        let rst = /Android[\s]?(\d+(?:\.\d+)*)?;/.exec(ua);
        if (rst) {
            return {name: "android", version: rst[1] || ""};
        }
        rst = /Windows\sNT\s(\d+(?:\.\d+)+);/.exec(ua);
        if (rst) {
            return {name: "windows", version: WindowsMapper.map(rst[1])};
        }
        rst = /Macintosh;[\s\S]+Mac\sOS\sX\s(\d+(?:[_.]\d+)*)+/.exec(ua);
        if (rst) {
            return {name: "macos", version: rst[1].replace(/_/g, ".")};
        }
        rst = /(iPad|iPhone|iPod\stouch);\sCPU\s(?:iPhone\s)?OS\s(\d+(?:[_.]\d+)*)\slike\sMac\sOS\sX/.exec(ua);
        if (rst) {
            return {name: "ios", version: rst[2].replace(/_/g, ".")};
        }
        rst = /(X11;){1,}[\s\S]+(Linux){1,}/.exec(ua);
        if (rst) {
            return {name: "linux", version: ""};
        }
        return null;
    }

    static parseBrowser(ua) {
        let rst = /(Firefox|FxiOS)\/(\d+(?:\.\w+)+)/.exec(ua);
        if (rst) {
            let v = rst[2];
            return {version: v, name: "firefox"};
        }
        rst = /(Chrome|CriOS)\/(\d+(?:\.\d+)+)/.exec(ua);
        if (rst) {
            let v = rst[2];
            return {version: v, name: "chrome"};
        }
        rst = /Version\/(\d+(?:\.\d+)+)\s(Mobile\/\w+\s)?Safari\/(\d+(?:\.\d+)+)/.exec(ua);
        if (rst) {
            let v = rst[1];
            return {version: v, name: "safari"};
        }
        return null;
    }
}

module.exports = {
    UserAgentParser : UserAgentParser,
    UserAgentDescriptor: UserAgentDescriptor,
    UnknownUserAgent: UnknownUserAgent
};

/************************************* END **************************************/

