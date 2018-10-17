function isValueNumber(value) {
    return (/(^-?[0-9]+\.{1}\d+$)|(^-?[1-9][0-9]*$)|(^-?0{1}$)/).test(value + '');
}
Vue.component('input-number', {
    template: '\
        <div class="input-number">\
            <input type="text" :value="currentValue" @change="handleChange">\
            <button @click="handleDown" :disabled="currentValue <= min">-</button>\
            <button @click="handleUp" :disabled="currentValue >= max" @keydown="handleUp" >+</button>\
        </div>',

    props: {
        max: {
            type: Number,
            default:Infinity
        },
        min: {
            type: Number,
            default:-Infinity
        },
        value: {
            type: Number,
            default:0
        }
    },

    //初始化时引用父组件value
    data: function () {
        return {
            currentValue:this.value
        }
    },

    //监听value和currentValue
    watch:{
        currentValue: function (val) {
            //在使用v-model时改变value
            this.$emit('input', val);
            //触发自定义事件"on-change"，告知父组件数字输入框的值有所改变，这里没有使用该事件
            this.$emit('on-change', val);
        },
        value: function(val) {
            this.updateValue(val);
        }
    },
    //从父组件传递过来的value可能不符合当前条件，方法updateValue过滤出一个正确的currentValue
    methods: {
        handleDown: function () {
            if (this.currentValue <= this.min) return;
            this.currentValue -= 1;
        },
        handleUp: function () {
            if (this.currentValue >= this.max) return;
            this.currentValue += 1;
        },
        updateValue: function (val) {
            if (val > this.max) val = this.max;
            if (val < this.min) val = this.min;
            this.currentValue = val;
        },
        handleChange: function (event) {
            var val = event.target.value.trim();

            var max = this.max;
            var min = this.min;
            if (isValueNumber(val)) {
                val = Number(val);
                this.currentValue = val;
                if (val > max) {
                    this.currentValue = max;
                } else if (val < min) {
                    this.currentValue = min;
                }
            } else {
                event.target.value = this.currentValue;
            }
        }        
    },
    //钩子函数
    mounted: function () {
        this.updateValue(this.value);
    }
});