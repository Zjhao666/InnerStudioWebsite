
testThreadPool.out:
	g++ testThreadPool.cpp ThreadPool.cpp Thread.cpp -o tmp.out -lpthread -std=c++11
	g++ ThreadPool.cpp Thread.cpp -o ThreadPool.so -fPIC -shared -lpthread -std=c++11
