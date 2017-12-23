package fr.vahren.life;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.Color;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

public class Life {

    LifeWorld world;
    Point position;
    Dir dir;

    List<Element> elements = new ArrayList<>(0);
    private Rectangle boundingBox;

    public Life(int x, int y, LifeWorld w) {
        position = new Point(x, y);
        this.world = w;
        boundingBox = boundingBox();
        dir = Dir.values()[ThreadLocalRandom.current().nextInt(Dir.values().length)];
    }

    public void act() {
        int action = ThreadLocalRandom.current().nextInt(100);
        if(action < 5){
            rotate(1);
        }else if (action < 30) {
            move();
        }else if (action < 40) {
            grow(0, 0);
        }

    }

    private void rotate(int i) {
        dir = Dir.values()[(dir.ordinal()+i)%Dir.values().length];
        elements.forEach(element -> {
            element.rotate(i);
        });
    }

    private void move(){
        switch (dir) {
            case UP:
                moveTo(position.x, position.y - 1);
                break;
            case DOWN:
                moveTo(position.x, position.y + 1);
                break;
            case LEFT:
                moveTo(position.x - 1, position.y);
                break;
            case RIGHT:
                moveTo(position.x + 1, position.y);
                break;
        }
    }

    private void moveTo(int x, int y) {
        if(canMoveTo(x,y)){
            position.x = x;
            position.y = y;
        }
    }

    private boolean canMoveTo(int x, int y) {
        // check for world borders
        if(x + boundingBox.left < 0 ||
                x + boundingBox.right > LifeApp.WIDTH-1 ||
                y + boundingBox.up < 0 ||
                y + boundingBox.down > LifeApp.HEIGHT-1){
            return false;
        }

        return true;
    }

    public void render(Pixmap p) {
        // draw core
        p.setColor(Color.BLACK);
        p.drawPixel(position.x,position.y);

        elements.forEach(e -> e.render(p));
    }

    public void grow(int x, int y) {

        // is the space empty ?
        if (world.canGrowHere(x + position.x, y + position.y)) {
            // GROW!
            elements.add(new Element(x, y, this));
            // refresh boundingBox
            refreshBoundingBox();
        } else {

            // choose a side to grow
            switch (getDir(x + position.x, y + position.y)) {
                case UP:
                    grow(x, y - 1);
                    break;
                case DOWN:
                    grow(x, y + 1);
                    break;
                case LEFT:
                    grow(x - 1, y);
                    break;
                case RIGHT:
                    grow(x + 1, y);
                    break;

            }
        }
    }

    private void refreshBoundingBox() {
        this.boundingBox = boundingBox();
    }

    public Point chooseMove() {
        int x = position.x;
        int y = position.y;
        switch (getDir(position.x, position.y)) {
            case RIGHT:
                x = position.x + 1;
                break;
            case LEFT:
                x = position.x - 1;
                break;
            case DOWN:
                y = position.y + 1;
                break;
            case UP:
                y = position.y - 1;
                break;
        }
        return new Point(x,y);
    }

    private static Dir getDir() {
        return Dir.values()[ThreadLocalRandom.current().nextInt(4)];
    }

    private Rectangle boundingBox() {
        // min bounding box is core
        int left = 0, right = 0, up = 0, down = 0;

        for (Element element : elements) {
            if (element.x() < left) {
                left = element.x();
            }
            if (element.x() > right) {
                right = element.x();
            }
            if (element.y() < up) {
                up = element.y();
            }
            if (element.y() > down) {
                down = element.y();
            }
        }

        return new Rectangle(left, right, up, down);
    }

    private Dir getDir(int x, int y) {
        List<Dir> available = new ArrayList<>(0);
        if (x + boundingBox.left > 0) {
            available.add(Dir.LEFT);
        }
        if (x + boundingBox.right < LifeApp.WIDTH - 1) {
            available.add(Dir.RIGHT);
        }
        if (y + boundingBox.up > 0) {
            available.add(Dir.UP);
        }
        if (y + boundingBox.down < LifeApp.HEIGHT - 1) {
            available.add(Dir.DOWN);
        }
        if (available.isEmpty()) {
            return Dir.NONE;
        } else {
            return Optional.ofNullable(available.get(ThreadLocalRandom.current().nextInt(available.size()))).orElse(Dir.NONE);
        }
    }

    enum Dir {
        LEFT, UP, RIGHT, DOWN, NONE
    }
}
