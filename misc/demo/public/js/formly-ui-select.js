/**
 * Created by leon on 15/11/9.
 */

angular.module('formlyExample', ['ui.neptune'])
    .factory("QueryCtrlCode", function (nptRepository) {
        return nptRepository("QueryMdCtrlcode");
    })
    .controller("formlyExampleController", function ($scope, QueryCtrlCode,$timeout) {
        var vm = this;

        vm.onSubmit = function onSubmit() {
            if (vm.form.$valid) {
                vm.options.updateInitialValue();
                alert(JSON.stringify(vm.model), null, 2);
            }
        };
        vm.model = {};
        $timeout(function() {
            vm.model.cycle1 = ["11111"];
            vm.model.cycle3 = ["once"];
        },1000);
        vm.fields = [
            {
                "key": "cycle1",
                "type": "ui-select",
                optionsTypes: ['notempty'],
                templateOptions: {
                    optionsAttr: 'bs-options',
                    label: '服务周期(静态数据):',
                    valueProp: 'id',
                    labelProp: 'name',
                    smallLabelProp: "defname",
                    placeholder: '请选择服务周期',
                    required: true,
                    options: [{
                        id: "11111",
                        name: "测试1"
                    }, {
                        id: "2222",
                        name: "测试2"
                    }, {
                        id: "3333",
                        name: "测试3"
                    }]
                }
            },
            {
                "key": "cycle2",
                "type": "ui-select",
                templateOptions: {
                    optionsAttr: 'bs-options',
                    label: '服务周期(指定数据源):',
                    valueProp: 'id',
                    labelProp: 'name',
                    smallLabelProp: "defname",
                    placeholder: '请选择服务周期',
                    required: true,
                    selectIndex:2,
                    options: [],
                    repository: QueryCtrlCode,
                    repositoryParams: {"defno": "cycle"}
                }
            }, {
                "key": "cycle3",
                "type": "ui-select",
                templateOptions: {
                    optionsAttr: 'bs-options',
                    label: '服务周期(输入内容搜索):',
                    valueProp: 'no',
                    labelProp: 'name',
                    smallLabelProp: "defname",
                    placeholder: '请选择服务周期',
                    multiple:'',
                    required: true,
                    options: [],
                    repository: QueryCtrlCode,
                    repositoryParams: {"defno": "cycle"},
                    search: ['no'],
                    allowClear:false
                }
            }];
        vm.originalFields = angular.copy(vm.fields);
    });