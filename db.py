
import pymysql as mysql

def execute(sql):
    with mysql.connect('101.200.37.220','root','Luncert428','InnerStudioWebsite') as cursor:
        retnum=cursor.execute(sql)
        if retnum:
            return cursor.fetchall()

sql_insert_Plan='''INSERT INTO
    Plan ( title, overview, state, stage )
    VALUES ( '{}', '{}', {}, '{}')'''

execute(sql_insert_Plan.format('Python race','How much do you know about python?',1,'''
[
	{
		"timestamp":"2016/11/08",
		"content":"learn css",
		"state":0
		"comments":[
			{
				"aid":"1",
				"timestamp":"2016/11/08",
				"content":"xxxx"
			},
			{
				"aid":"1",
				"timestamp":"2016/11/08",
				"content":"xxxx"
			},
			{
				"aid":"1",
				"timestamp":"2016/11/08",
				"content":"xxxx"
			}
		]
	}
]
'''))
