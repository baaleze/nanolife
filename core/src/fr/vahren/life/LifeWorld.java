package fr.vahren.life;

import com.badlogic.gdx.graphics.Pixmap;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.IntStream;

public class LifeWorld {

    public List<Life> life = new ArrayList<>(10);


    public void addLife() {
        life.add(new Life(randomInt(LifeApp.WIDTH), randomInt(LifeApp.HEIGHT), this));
    }


    public static int randomInt(int max) {
        return ThreadLocalRandom.current().nextInt( max + 1);
    }

    public void addLife(int i) {
        IntStream.range(0,i).forEach(x -> addLife());
    }

    public void update() {
        life.forEach(Life::act);
    }

    public void render(Pixmap p) {
        life.forEach(l -> l.render(p));
    }
}