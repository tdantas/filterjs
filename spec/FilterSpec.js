describe("Filter", function() {
  var filter;

  var john    =  { id:1, name: 'John Doe', sex: 'Male', age:19 , country: "Uk", signup: "2013-01-10T00:00:00.000Z" }
  var rick    =  { id:2, name: 'Rick Martin', sex: 'Male', age:35, country: "Usa", signup: "2013-01-10T00:00:00.000Z" }
  var joaquim =  { id:3, name: 'Joaquim Barbosa', sex: 'Male', age:58, country: "Brasil", signup: "2013-08-12T00:00:00.000Z" }
  var dilma   =  { id:4, name: 'Dilma', sex: 'Female', age:52, country: "Brasil", signup: "2013-06-15T00:00:00.000Z" }
  var ze   =     { id:5, name: 'Zé da Sardinha', sex: 'Male', age:40, country: "Portugal", signup: "2013-05-01T00:00:00.000Z" }

  var serverData = [ john, rick, joaquim, dilma, ze ] 
                     
  describe("filtering Fields", function(){
    beforeEach(function() {
      var map = { name: Filter.STRING, country: Filter.STRING }
      filter = new Filter(serverData, map)
    });
   
   describe("criterias", function(){
    describe("#by name", function(){
      it("complete name", function() {
        result = filter.results({ name: { contains: 'John Doe' } } )
        expect(result).toEqual([john])
      });

      it("start name", function(){
        result = filter.results({name: { contains: 'John'} })
        expect(result).toEqual([john])
      });

      it("last name", function(){
        result = filter.results({name: { contains: 'Barbosa' } } )
        expect(result).toEqual([joaquim])
      });

      it("partial name", function(){ 
        result = filter.results({name: { eq: 'bosa' } })
        expect(result).toEqual([joaquim])
      })
  
    describe("case insensitive",function(){
        it("name", function(){ 
          result = filter.results({name: { eq: 'joaquim' }})
          expect(result).toEqual([joaquim])
        })
      }) 
    });
    
    describe("by country", function(){
      it("returns all from Brasil", function(){
        result = filter.results({country: { eq: 'Brasil'} })
        expect(result).toEqual([joaquim, dilma]);
      })
      
      describe("insensitive", function(){
        it("from brasil", function(){
          result = filter.results({country: { eq: 'brasil' } })
          expect(result).toEqual([joaquim, dilma]);
        })
      })
    })
    
    describe("by country and name", function(){
      it("return from Brasil and Joaquim", function(){
        result = filter.results({country: { eq: 'Brasil'}, name: {eq: 'Joaquim'}})
        expect(result).toEqual([joaquim]);
      })
      
      it("return john from uk", function(){
        result = filter.results({country: { eq:'uk'} , name: { eq: 'doe' } })
        expect(result).toEqual([john]);
      })
    })
    
    describe("by age", function(){
       beforeEach(function() {
        var map = { name: Filter.STRING, country: Filter.STRING , age: Filter.NUMBER }
        filter = new Filter(serverData, map)
      });
       
      it("returns greater than 50", function(){
        result = filter.results({ age: { gte: 50 }})
        expect(result).toEqual([joaquim, dilma]);
      })
    })

    describe("by age and name", function(){
      beforeEach(function() {
        var map = { name: Filter.STRING, country: Filter.STRING , age: Filter.NUMBER }
        filter = new Filter(serverData, map)
      });

      it("returns joaquim", function(){
        result = filter.results({ age: { gte: 53 }, name: { contains: "barbo"} })
        expect(result).toEqual([joaquim]);
      })
      
      it("returns ze", function(){
        result = filter.results({ age: { gte: 30 }, country: { contains: "portugal"} })
        expect(result).toEqual([ze]);
      })
      
      it("returns ze when query for gt 30, name sardinha and country portugal", function(){
        result = filter.results({ age: { gte: 30 }, country: { contains: "portugal"}, name: {eq: "sardinha" } } )
        expect(result.length).toEqual(1);
        expect(result).toEqual([ze]);
      })
    })
    
    describe("without criterias", function(){
      it("returns all", function(){
          result = filter.results({})
          expect(result).toEqual(serverData);
         })
      })

      describe("criteria without match" , function(){
        it("returns nothing", function(){
          result = filter.results({name: {eq: 'thiago'}})
          expect(result).toEqual([]);
        })
      })

      describe("invalid criteria", function(){
        it("returns nothing invalid operator", function(){
          result = filter.results({ name: { none: 'thiago'}})
          expect(result).toEqual([]);
        })
      })

    describe("mapping" , function(){
      beforeEach(function() {
        var map = { name: Filter.STRING, country: Filter.STRING }
        filter = new Filter(serverData, map)
      });

      it("filter ignore not mapping fields", function(){
        expect(function(){ filter.results({ age: { gte: 1} }) } ).toThrow("Key not mapped")
       })
     }) 
    })
  })

 });
