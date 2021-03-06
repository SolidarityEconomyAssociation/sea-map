// The view aspects of the Main Menu sidebar
define(["d3", "view/base", "presenter/searchbox"], function(
  d3,
  viewBase,
  presenter
) {
  "use strict";

  function SearchBoxView() {}
  // inherit from the standard view base object:
  var proto = Object.create(viewBase.base.prototype);

  proto.changeSearchText = function(txt) {
    d3.select("#search-box").property("value", txt);

  };

  proto.searchSubmitted = function() {
   
  };
  proto.createSearchBox = function() {
    // d3 selection redefines this, so hang onto it here:
    var view = this;
    var selection = this.d3selectAndClear("#map-app-search-widget");

    selection = selection
      .append("form")
      .attr("id", "map-app-search-form")
      .attr(
        "class",
        "w3-card-4 w3-light-grey w3-round w3-opacity w3-display-topright map-app-search-form"
      )
      .on("submit", function() {
        view.searchSubmitted();
      })
      .append("div")
      .attr("class", "w3-row w3-border-0");
    selection
      .append("div")
      .attr("class", "w3-col")
      .attr("title", "Click to search")
      .style("width", "60px")
      .append("button")
      .attr("type", "submit")
      .attr("class", "w3-btn w3-border-0")
      .append("i")
      .attr("class", "w3-xlarge fa fa-search");
    selection
      .append("div")
      .attr("class", "w3-rest")
      .append("input")
      .attr("id", "search-box")
      .attr("class", "w3-input w3-border-0 w3-round w3-mobile")
      .attr("type", "search")
      .attr("placeholder", "Search initiatives")
      .attr("autocomplete","off");

      //search (addr/domains)
      //

     
  };
  SearchBoxView.prototype = proto;
  //var view;

  function init() {
    const view = new SearchBoxView();
    view.setPresenter(presenter.createPresenter(view));
    view.createSearchBox();
    return view;
  }
  var pub = {
    init: init
  };

  return pub;
});
