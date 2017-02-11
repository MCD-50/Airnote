import React from 'react';
import ReactNative from 'react-native';

import TextExtraction from './utils/textextraction.js';

// /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{1,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
//  ^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?
//        /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/
const PATTERNS = {
    url: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/,
    phone: /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/,
    email: /\S+@\S+\.\S+/,
};

const defaultParseShape = React.PropTypes.shape({
    ...ReactNative.Text.propTypes,
    type: React.PropTypes.oneOf(Object.keys(PATTERNS)).isRequired,
});

const customParseShape = React.PropTypes.shape({
    ...ReactNative.Text.propTypes,
    pattern: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.instanceOf(RegExp)]).isRequired
});

class ParsedText extends React.Component {

    static displayName = 'ParsedText';

    static propTypes = {
        ...ReactNative.Text.propTypes,
        parse: React.PropTypes.arrayOf(
            React.PropTypes.oneOfType([defaultParseShape, customParseShape]),
        ),
    };

    static defaultProps = {
        parse: null,
    };

    setNativeProps(nativeProps) {
        this._root.setNativeProps(nativeProps);
    }

    getPatterns() {
        return this.props.parse.map((option) => {
            const {type, ...patternOption} = option;
            if (type) {
                if (!PATTERNS[type]) {
                    throw new Error(`${option.type} is not a supported type`);
                }
                patternOption.pattern = PATTERNS[type];
            }

            return patternOption;
        });
    }

    getParsedText() {
        if (!this.props.parse) { return this.props.children; }
        if (typeof this.props.children !== 'string') { return this.props.children; }

        const textExtraction = new TextExtraction(this.props.children, this.getPatterns());

        return textExtraction.parse().map((props, index) => {
            return (
                <ReactNative.Text
                    key={`parsedText-${index}`}
                    {...props}
                />
            );
        });
    }

    isURL(str) {
        var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
        var url = new RegExp(urlRegex, 'i');
        return str.length < 2083 && url.test(str);
    }

    render() {
        return (
            <ReactNative.Text

                ref={ref => this._root = ref}
                {...this.props}>
                {this.getParsedText()}
            </ReactNative.Text>
        );
    }

}

export default ParsedText;