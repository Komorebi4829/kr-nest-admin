export const template = (content: string) => {
    return `
    <!Doctype html>
          <html>
            <head>
              <title>Preview!</title>
              <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet" />
              <style>
                span{
                  word-break: break-word;
                }
                html,body{
                  height: 100%;
                  margin: 0;
                  padding: 0;
                  overflow: auto;
                  background-color: #f1f2f3;
                }
                .ql-container{
                  box-sizing: border-box;
                  width: 1000px;
                  max-width: 100%;
                  min-height: 100%;
                  margin: 0 auto;
                  padding: 30px 20px;
                  overflow: hidden;
                  background-color: #fff;
                  border-right: solid 1px #eee;
                  border-left: solid 1px #eee;
                }
                .ql-container img,
                .ql-container audio,
                .ql-container video{
                  max-width: 100%;
                  height: auto;
                }
                .ql-container p{
                  white-space: pre-wrap;
                  min-height: 1em;
                }
                .ql-container pre{
                  padding: 15px;
                  background-color: #f1f1f1;
                  border-radius: 5px;
                }
                .ql-container blockquote{
                  margin: 0;
                  padding: 15px;
                  background-color: #f1f1f1;
                  border-left: 3px solid #d1d1d1;
                }
                table {
                  width:100%;
                  border-collapse: collapse;
                }
          
                td {
                    border: 1px solid black;
                    padding:1rem 0;
                }
              </style>
            </head>
            <body>
              <div class="ql-container">
                <div class="ql-editor">
                  ${content}
                </div>
              </div>
            </body>
          </html>
    `
}
