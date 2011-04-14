

Hash = function(){
    this.length = 0;
    this.items = [];
    for (var i = 0; i < arguments.length; i += 2) {
        if (typeof(arguments[i + 1]) != 'undefined') {
            this.items[arguments[i]] = arguments[i + 1];
            this.length++;
        }
    }
};
    
Hash.prototype = {
         
    getKeys: function() {
        var keys = [];
        for( var key in this.items ) {
            if (this.items.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        return keys;      
    },
    
    getValues:  function() {
        var values = [];
        for( var key in this.items ) {
            if (this.items.hasOwnProperty(key)) {
                values.push(this.items[key]);
            }
        }
        return values;      
    },
    
    removeItem :  function(in_key){
        var tmp_value;
        if (typeof(this.items[in_key]) != 'undefined') {
            this.length--;
            tmp_value = this.items[in_key];
            delete this.items[in_key];
        }
        
        return tmp_value;
    },
    
    getItem : function(in_key){
        return this.items[in_key];
    },
    
    setItem : function(in_key, in_value){
        if (typeof(in_value) != 'undefined') {
            if (typeof(this.items[in_key]) == 'undefined') {
                this.length++;
            }
            
            this.items[in_key] = in_value;
        }
        
        return in_value;
    },
    
    hasItem : function(in_key){
        return typeof(this.items[in_key]) != 'undefined';
    }
};


exports = { 
    Hash: Hash, 
};
