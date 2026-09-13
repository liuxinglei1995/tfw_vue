<template>
    <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 500px; overflow-y: hidden"
        v-model="htmlText"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
      />
    </div>
  </template>
  
  <script>
  import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
  import { ajax } from "@/utils";
  
  import "@wangeditor/editor/dist/css/style.css";
  export default {
    components: { Editor, Toolbar },
    props: ["content"],
    data() {
      return {
        editor: null,
        htmlText: "",
        // 工具栏配置
        toolbarConfig: {
          //工具栏不显示某个按钮
          excludeKeys: [
            "fullScreen", // 不显示全屏
            "insertVideo", // 不显示插入视频
          ],
        },
  
        // 编辑器配置
        editorConfig: {
          placeholder: "请输入内容...",
  
          // 所有的菜单配置，都要在 MENU_CONF 属性下
          MENU_CONF: {
            // 上传图片的配置
            uploadImage: {
              customUpload: this.uploadImg, // 调用自定义的方法
            },
          },
        },
  
        // or 'default' 简洁模式/默认模式
        mode: "simple",
      };
    },
    watch: {
      content(val) {
        // 使用 $nextTick，确保在下一次 DOM 更新周期中再修改 htmlText，以避免与 v-model 的冲突
        this.$nextTick(() => {
          this.htmlText = val;
        });
      },
    },
  
    methods: {
      onCreated(editor) {
        this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
  
        // console.log('获取toolbar所有key：',this.editor.getAllMenuKeys())
      },
  
      async uploadImg(file, insertFn) {
        let formdata = new FormData();
        formdata.append("file", file);
  
        // 发请求
        ajax({
          method: "post",
          url: "xxx",
          data: formdata,
        }).then((res) => {
          // 上传成功后插入图片，需要后端返回图片地址
          insertFn(res.url, res.name, res.url);
        });
      },
    },
  
    // 组件销毁时，及时销毁编辑器
    beforeDestroy() {
      const editor = this.editor;
      if (editor == null) return;
      editor.destroy();
    },
  };
  </script>
  
  <style>
  </style>