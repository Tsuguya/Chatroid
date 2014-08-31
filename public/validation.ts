class Validation {
    private _nodes: { [key: string]: HTMLInputElement } = {};
    private _val_error: { [key: string]: { [key: string]: boolean } };
    private _error_message: { [key: string]: { [key: string]: string } } = {};
    public afterSection;

    constructor(form_id: string, error_message: { [key: string]: { [key: string]: string } } = {}, afterSection: any = function(){}) {
        this.afterSection = afterSection;
        var form: any = document.getElementById(form_id);
        for(var i: number = 0; i < form.length; i++) {
            var element = form.elements[i];
            if(!element.getAttribute("data-validate-types")) continue;
            this._nodes[element.name] = element;
        }
        for(var key in this._nodes) {
            //デフォルト定義
            this._error_message[key] = {};
            var types: any = this._nodes[key].getAttribute("data-validate-types");
            if(types) {
                types = types.split("|");
                for(var num in types) {
                    var pair:any = this._separateValidType(types[num]);
                    if(pair.option === null) {
                        this._error_message[key][pair.type] = this.validateType[pair.type].message(error_message[key]["name"]);
                        continue;
                    }
                    this._error_message[key][pair.type] = this.validateType[pair.type].message(error_message[key]["name"], pair.option);
                }
            }

            for(var my_type in error_message[key]) {
                if(my_type == "name") continue;
                //カスタム定義
                this._error_message[key][my_type] = error_message[key][my_type];
            }
        }
    }

    public validate() {
        this._val_error = {};
        for (var key in this._nodes) {
            var value: string = this._nodes[key].value;
            var vtypes: any = this._nodes[key].getAttribute("data-validate-types");
            if(!vtypes) continue;
            vtypes = vtypes.split("|");
            var result: { [key: string]: boolean } = {};
            for (var num in vtypes) {
                var types = this._separateValidType(vtypes[num]);
                if(typeof this.validateType[types.type].valid != "function") continue;
                if(types.option === null) {
                    result[types.type] = this.validateType[types.type].valid(value);
                } else {
                    result[types.type] = this.validateType[types.type].valid(value, types.option);
                }
            }
            this._val_error[key] = result;
        }
        this.afterSection();
    }

    private valid(node_name:string):any {
        var node = this._nodes[node_name];
        var element_name = node.nodeName;
        var valid_type:string[] = node.getAttribute("data-validate-types").split('|');
        if(!valid_type) return;

        for(var i in valid_type) {
            var types = this._separateValidType(valid_type[i]);

        }

    }

    public validateType = {
        required: {
            valid: (value: string) =>  value !== "",
            message: (name: string) => name + "は必須項目です。"
        },
        is_numeric: {
            valid: (value: string) => Boolean( !value.match(/[^0-9]*$/) ),
            message: (name: string) => name + "は数字で記入してください。"
        },
        integer: {
            valid: (value: string) => Boolean( value.match(/^[\-+]?[0-9]+$/) ),
            message: (name: string) => name + "は数字で記入してください。(先頭のみ+-が使えます。)"
        },
        min_length: {
            valid: (value: string, length: string) => value.length >= parseInt(length),
            message: (name: string, length: string) => name + "は" + length + "文字以上で記入してください。"
        },
        max_length: {
            valid: (value: string, length: string) => value.length <= parseInt(length),
            message: (name: string, length: string) => name + "は" + length +"文字以内で記入してください。"
        },
        exact_length: {
            value: (value: string, length: string) => value.length === parseInt(length),
            message: (name: string, length: string) => name + "は" + length + "文字で記入してください。"
        },
        match: {
            value: (value: string, compare_name: string) => value === this._nodes[compare_name].value,
            message: (name: string, name2: string) => name + "と" + name2 + "が一致しません。"
        },
        email: {
            value: (value: string) => Boolean( value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/) ),
            message: (name: string) => name + "を記入してください"
        }
    };

    // find option in validate type
    private _separateValidType = function(intact_type: string):{type:string;option:string} {
        var option: any = intact_type.match(/[\[].*[\]]/g);
        if(!option) return { type: intact_type, option: null };
        option = option[0].substr(1, option[0].length - 2);
        var type = intact_type.replace(/[\[].*[\]]/g,"");
        return { type: type, option: option };
    }

}